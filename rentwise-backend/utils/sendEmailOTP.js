const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmailOTP(toEmail, otp) {
  const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: 'Your OTP Code for RentWise',
      html: `<p>Hello,</p>
             <p>Your OTP code is: <strong>${otp}</strong></p>
             <p>Please enter this code to proceed. It will expire in 5 minutes.</p>
             <br>
             <p>Best Regards,<br>RentWise Team</p>`
  };

  try {
      await transporter.sendMail(mailOptions);
  } catch (error) {
      console.error('Error sending email:', error);
  }
}

module.exports = {sendEmailOTP}