const emailjs = require('@emailjs/nodejs');

// EmailJS Configuration
const emailConfig = {
    serviceId: 'service_oe37ebk',
    orderTemplateId: 'template_bugphvq',
    publicKey: 'jb9HjClX6opE8FYPJ',
    adminEmail: 'hope.failure.pdx@gmail.com',
};

// Initialize EmailJS
emailjs.init({
    publicKey: emailConfig.publicKey,
});

module.exports = {
    emailjs,
    emailConfig,
};
