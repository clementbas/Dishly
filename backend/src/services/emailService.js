const nodemailer = require('nodemailer');
const welcomeEmail = require('../templates/welcomeEmail');

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

const sendWelcomeEmail = async (user) => {
  if (!process.env.SMTP_HOST) return;

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Dishly 🍽️" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: user.email,
    subject: `Bienvenue sur Dishly, ${user.username} ! 🎉`,
    html: welcomeEmail(user.username),
  });
};

module.exports = { sendWelcomeEmail };
