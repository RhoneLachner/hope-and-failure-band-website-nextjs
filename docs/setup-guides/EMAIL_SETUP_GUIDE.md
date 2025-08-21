# Email Setup Guide for Hope & Failure Website

This guide will help you set up email functionality for the contact form using EmailJS.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail** (recommended for hope.failure.pdx@gmail.com)
4. Follow the OAuth setup to connect your Gmail account
5. Note down your **Service ID** (you'll need this later)

## Step 3: Create Email Template

1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Use this template content:

```
Subject: New Contact Form Submission - Hope & Failure Website

From: {{name}} <{{email}}>
To: hope.failure.pdx@gmail.com

Message:
{{message}}

---
This message was sent from the Hope & Failure website contact form.
Reply directly to this email to respond to the sender.
```

4. Set the template variables:
    - `{{name}}` - sender's name
    - `{{email}}` - sender's email
    - `{{message}}` - message content
5. Save the template and note down your **Template ID**

## Step 4: Get Your Public Key

1. Go to **Account** in your EmailJS dashboard
2. Find your **Public Key** (also called User ID)
3. Copy this key

## Step 5: Update Configuration

1. Open `app/api-services/emailConfig.ts`
2. Replace the placeholder values with your actual credentials:

```typescript
export const emailConfig = {
    serviceId: 'service_xxxxxxx', // Your actual service ID
    templateId: 'template_xxxxxxx', // Your actual template ID
    publicKey: 'your_public_key_here', // Your actual public key
};
```

## Step 6: Test the Contact Form

1. Start your development server: `npm run dev`
2. Navigate to the Contact page
3. Fill out the form and submit
4. Check your Gmail inbox for the test email

## Security Notes

-   EmailJS free tier allows 200 emails per month
-   All emails are sent through EmailJS servers
-   Your Gmail credentials are stored securely by EmailJS
-   The public key is safe to expose in frontend code

## Troubleshooting

### Common Issues:

1. **"Failed to send message"**

    - Check that all credentials are correct
    - Verify your Gmail account is properly connected
    - Check browser console for detailed error messages

2. **Template not found**

    - Ensure your template ID is correct
    - Make sure the template is published/active

3. **Service not found**
    - Verify your service ID is correct
    - Check that the Gmail service is properly configured

### Testing Tips:

-   Use browser developer tools to check network requests
-   Check EmailJS dashboard for sending statistics
-   Test with different email addresses to ensure delivery

## Alternative Solutions

If EmailJS doesn't work for your needs, consider these alternatives:

1. **Netlify Forms** (if hosting on Netlify)
2. **Formspree** (similar to EmailJS)
3. **Backend API** (requires server setup)
4. **mailto: links** (opens user's email client)

## Support

For EmailJS specific issues, visit their documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)

For website-specific issues, check the browser console for error messages.
