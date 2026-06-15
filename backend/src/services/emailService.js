const nodemailer = require('nodemailer');
const welcomeEmail = require('../templates/welcomeEmail');
const verificationEmail = require('../templates/verificationEmail');

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

const sendMail = async (options) => {
  if (!process.env.SMTP_HOST) return;
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Dishly 🍽️" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    ...options,
  });
};

const sendWelcomeEmail = (user) =>
  sendMail({
    to: user.email,
    subject: `Bienvenue sur Dishly, ${user.username} ! 🎉`,
    html: welcomeEmail(user.username),
  });

const sendVerificationEmail = (user, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify/${token}`;
  return sendMail({
    to: user.email,
    subject: 'Vérifiez votre adresse email — Dishly',
    html: verificationEmail(user.username, verificationUrl),
  });
};

module.exports = { sendWelcomeEmail, sendVerificationEmail };
