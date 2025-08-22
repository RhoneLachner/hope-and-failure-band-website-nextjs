// EmailJS Configuration
// To set up EmailJS:
// 1. Go to https://www.emailjs.com/
// 2. Create a free account
// 3. Create a new service (Gmail integration)
// 4. Create an email template
// 5. Get your public key from the dashboard
// 6. Replace the values below with your actual credentials

export const emailConfig = {
    serviceId: 'service_oe37ebk', // Replace with your EmailJS service ID
    templateId: 'template_ete7jwu', // Replace with your EmailJS template ID
    publicKey: 'jb9HjClX6opE8FYPJ', // Replace with your EmailJS public key
};

// Example template variables that will be available in your EmailJS template:
// {{name}} - sender's name
// {{email}} - sender's email
// {{message}} - message content
// {{to_email}} - recipient email (hope.failure.pdx@gmail.com)

export const emailTemplate = {
    to_email: 'hope.failure.pdx@gmail.com',
    subject: 'New Contact Form Submission - Hope & Failure Website',
};
