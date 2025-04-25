const nodemailer = require('nodemailer');
require('dotenv').config();

const sendMail = async (name, email, message) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `New Contact Message from ${name}`,
    text: `You have a message from ${name} (${email}):\n\n${message}`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
