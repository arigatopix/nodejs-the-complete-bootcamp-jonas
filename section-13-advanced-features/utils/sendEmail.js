const nodemailer = require('nodemailer');
const config = require('../config');

const sendEmail = async options => {
  // 1) create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  });

  // 2) Define the mail options
  const mailOptions = {
    from: 'no-reply <no-reply@natours.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html,
  };

  // 3) Actully send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
