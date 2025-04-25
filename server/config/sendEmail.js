const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // Use your email service (e.g., Gmail, Outlook, etc.)
            auth: {
                user: process.env.EMAIL_USER, // Your email address (set in environment variables)
                pass: process.env.EMAIL_PASS  // Your email password (set in environment variables)
            },
            tls: {
                rejectUnauthorized: false // Allow self-signed certificates
            }
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to,                           // Recipient address
            subject,                      // Subject line
            text                          // Email body
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email could not be sent');
    }
};

module.exports = sendEmail;