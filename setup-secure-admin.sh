#!/bin/bash

# Setup script for Hope & Failure band website security configuration
# This script helps configure the secure admin authentication

echo "🛡️  Hope & Failure - Secure Admin Setup"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "Expected structure: ./backend/ and ./frontend/"
    exit 1
fi

echo "📁 Project structure verified ✅"
echo ""

# Step 1: Generate admin password hash
echo "🔐 Step 1: Generate Admin Password Hash"
echo "--------------------------------------"
echo "Enter your secure admin password (or press Enter for default):"
read -s -p "Password: " admin_password
echo ""

if [ -z "$admin_password" ]; then
    admin_password="secure-admin-password-2024"
    echo "Using default password: $admin_password"
fi

echo "Generating password hash..."
cd backend
hash_output=$(node scripts/generateAdminHash.js "$admin_password" 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "✅ Password hash generated successfully"

    # Extract the hash from the output
    admin_hash=$(echo "$hash_output" | grep "ADMIN_PASSWORD_HASH=" | cut -d'=' -f2)

    if [ -n "$admin_hash" ]; then
        echo "Hash: $admin_hash"
    else
        echo "❌ Failed to extract hash from output"
        exit 1
    fi
else
    echo "❌ Failed to generate password hash"
    echo "Make sure you've run 'npm install' in the backend directory"
    exit 1
fi

cd ..

# Step 2: Update backend .env
echo ""
echo "📝 Step 2: Configure Backend Environment"
echo "---------------------------------------"

backend_env_file="backend/.env"

if [ -f "$backend_env_file" ]; then
    echo "Found existing backend/.env file"

    # Check if ADMIN_PASSWORD_HASH already exists
    if grep -q "ADMIN_PASSWORD_HASH=" "$backend_env_file"; then
        echo "Updating existing ADMIN_PASSWORD_HASH..."
        # Update existing line
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/^ADMIN_PASSWORD_HASH=.*/ADMIN_PASSWORD_HASH=$admin_hash/" "$backend_env_file"
        else
            # Linux
            sed -i "s/^ADMIN_PASSWORD_HASH=.*/ADMIN_PASSWORD_HASH=$admin_hash/" "$backend_env_file"
        fi
    else
        echo "Adding ADMIN_PASSWORD_HASH to existing .env file..."
        echo "" >> "$backend_env_file"
        echo "# === SECURITY CONFIGURATION ===" >> "$backend_env_file"
        echo "ADMIN_PASSWORD_HASH=$admin_hash" >> "$backend_env_file"
    fi

    # Add STRIPE_WEBHOOK_SECRET if not present
    if ! grep -q "STRIPE_WEBHOOK_SECRET=" "$backend_env_file"; then
        echo "STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here" >> "$backend_env_file"
        echo "⚠️  Remember to update STRIPE_WEBHOOK_SECRET with your actual webhook secret"
    fi
else
    echo "Creating new backend/.env file..."
    cat > "$backend_env_file" << EOF
# === SECURITY CONFIGURATION ===
ADMIN_PASSWORD_HASH=$admin_hash
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# === DATABASE CONFIGURATION ===
# Add your database URLs here
# DATABASE_URL=postgresql://...
# DIRECT_URL=postgresql://...

# === STRIPE CONFIGURATION ===
# Add your Stripe secret key here
# STRIPE_SECRET_KEY=sk_test_...

# === APPLICATION CONFIGURATION ===
CLIENT_URL=http://localhost:3001
PORT=3000
NODE_ENV=development
EOF
    echo "⚠️  Remember to add your database URLs and Stripe configuration"
fi

echo "✅ Backend environment configured"

# Step 3: Update frontend .env.local
echo ""
echo "🎨 Step 3: Configure Frontend Environment"
echo "----------------------------------------"

frontend_env_file="frontend/.env.local"

cat > "$frontend_env_file" << EOF
# === ADMIN CONFIGURATION ===
NEXT_PUBLIC_ADMIN_PASSWORD=$admin_password

# === API CONFIGURATION ===
NEXT_PUBLIC_API_URL=http://localhost:3000
EOF

echo "✅ Frontend environment configured"

# Final instructions
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "✅ Admin password hash configured in backend/.env"
echo "✅ Admin password configured in frontend/.env.local"
echo ""
echo "🔐 Your secure admin password: $admin_password"
echo ""
echo "📋 Next steps:"
echo "1. Add your database URLs to backend/.env"
echo "2. Add your Stripe configuration to backend/.env"
echo "3. Update STRIPE_WEBHOOK_SECRET in backend/.env"
echo "4. Restart your servers: npm run dev"
echo ""
echo "🚨 Security Notes:"
echo "- Never commit .env files to version control"
echo "- Keep your admin password secure"
echo "- Use strong passwords in production"
echo ""
echo "📖 See ENVIRONMENT_SETUP.md for detailed instructions"
