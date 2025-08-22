const bcrypt = require('bcrypt');

async function generateAdminHash() {
    // Replace 'your-secure-admin-password' with your actual secure password
    const password = process.argv[2] || 'secure-admin-password-2024';
    const saltRounds = 12;

    try {
        const hash = await bcrypt.hash(password, saltRounds);
        console.log('\n🔐 Generated Admin Password Hash:');
        console.log('='.repeat(50));
        console.log(`Password: ${password}`);
        console.log(`Hash: ${hash}`);
        console.log('='.repeat(50));
        console.log('\n📝 Add this to your backend/.env file:');
        console.log(`ADMIN_PASSWORD_HASH=${hash}`);
        console.log(
            '\n⚠️  Important: Change the password to something secure!'
        );
        console.log(
            'Usage: node scripts/generateAdminHash.js "your-secure-password"'
        );
    } catch (error) {
        console.error('Error generating hash:', error);
    }
}

generateAdminHash();
