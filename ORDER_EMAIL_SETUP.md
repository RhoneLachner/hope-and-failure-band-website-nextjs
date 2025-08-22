# 📧 Order Email Setup Guide

## 🎯 **What's Been Added:**

-   ✅ Admin order notification emails (you get notified of new orders)
-   ✅ Integrated with your existing EmailJS account
-   ✅ Full order details with customer info and shipping
-   ✅ Stripe handles customer receipts automatically

## 🔧 **EmailJS Template Setup Required:**

### **Step 1: Create Order Email Template**

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Navigate to **Email Templates**
3. Click **Create New Template**
4. **Template ID**: `template_order_confirmation`
5. **Template Name**: "New Order Notification"

### **Step 2: Email Template Content**

**Subject:** `New Order #{{order_id}} - Hope & Failure`

**Email Body:**

```html
<!DOCTYPE html>
<html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                color: #333;
            }
            .header {
                background: #000;
                color: #fff;
                padding: 20px;
                text-align: center;
            }
            .content {
                padding: 20px;
            }
            .order-details {
                background: #f5f5f5;
                padding: 15px;
                margin: 20px 0;
            }
            .items {
                margin: 15px 0;
            }
            .footer {
                background: #eee;
                padding: 15px;
                text-align: center;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>HOPE & FAILURE</h1>
            <h2>New Order Received!</h2>
        </div>

        <div class="content">
            <h3>New order from {{customer_name}}</h3>

            <div class="order-details">
                <strong>Order ID:</strong> {{order_id}}<br />
                <strong>Order Date:</strong> {{order_date}}<br />
                <strong>Total:</strong> ${{order_total}}
            </div>

            <h4>Items Ordered:</h4>
            <div class="items">{{order_items}}</div>

            <h4>Shipping Address:</h4>
            <div>{{shipping_address}}</div>

            <h4>Customer Contact:</h4>
            <div>
                <strong>Email:</strong> {{customer_email}}<br />
                <strong>Name:</strong> {{customer_name}}
            </div>

            <p><strong>Action needed:</strong> Process and ship this order.</p>
        </div>

        <div class="footer">
            <p>Hope & Failure Order Management System</p>
        </div>
    </body>
</html>
```

### **Step 3: Update Configuration**

Edit `app/api-services/orderEmailService.ts` line 8:

```typescript
orderTemplateId: 'template_order_confirmation', // Your actual template ID
```

### **Step 4: Template Variables**

Your template can use these variables:

**Customer Info:**

-   `{{customer_name}}` - Customer's name
-   `{{customer_email}}` - Customer's email

**Order Details:**

-   `{{order_id}}` - Unique order ID
-   `{{order_date}}` - Formatted order date
-   `{{order_total}}` - Total amount
-   `{{order_items}}` - List of items with quantities
-   `{{item_count}}` - Number of items

**Shipping:**

-   `{{shipping_address}}` - Formatted shipping address

**Email Routing:**

-   `{{to_email}}` - Recipient email (customer or admin)
-   `{{reply_to}}` - Reply-to address

## 🧪 **Testing:**

1. **Complete template setup** in EmailJS
2. **Test order** with real email address
3. **Check console** for email status logs:
    ```
    📧 Sending admin order notification...
    ✅ Admin notification email sent
    ```

## 🎯 **Email Flow:**

1. **Customer completes checkout** → Stripe processes payment
2. **Order confirmed** → Inventory updated
3. **Admin email sent automatically** → You get order notification
4. **Stripe sends customer receipt** → Customer gets payment confirmation

## 📋 **What You'll Receive:**

**Admin Notification Email:**

-   New order alert with order ID
-   Customer contact information (name & email)
-   Complete itemized order details
-   Shipping address for fulfillment
-   Order total and date
-   Ready to process and ship

**Customer Gets:**

-   Stripe payment receipt (automatic)
-   Payment confirmation
-   Transaction details

## ⚠️ **Important:**

-   Admin emails send **after successful payment**
-   **Non-blocking** - checkout completes even if email fails
-   **Console logs** show email status
-   Uses your **existing EmailJS account**
-   **Stripe handles customer receipts** - no setup needed

**Once you create the admin template, you'll get notified of every order!** 🎉
