import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


dotenv.config();



if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
  throw new Error('Missing environment variables: EMAIL or EMAIL_PASSWORD');
}

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendResetPasswordEmail = (to, token) => {
  const resetUrl = `http://localhost:3000/reset-password/${token}`;
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: 'Password Reset',
    text: `You requested a password reset. Please use the following link to reset your password: ${resetUrl}`,
  };

  return transporter.sendMail(mailOptions)
    .then(info => console.log(`Email sent: ${info.response}`))
    .catch(error => console.error(`Error sending email: ${error}`));
};

export default sendResetPasswordEmail;
