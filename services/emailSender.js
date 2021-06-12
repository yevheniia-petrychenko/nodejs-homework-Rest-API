const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
const emailConfig = require('../config/config');
require('dotenv').config();

class CreateSenderSG {
  async send(msg) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return await sgMail.send({ ...msg, from: emailConfig.email.sendgrid });
  }
}

class CreateSenderNodemailer {
  async send(msg) {
    const config = {
      host: 'smtp.meta.ua',
      port: 465,
      secure: true,
      auth: {
        user: emailConfig.email.nodemailer,
        pass: process.env.PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport(config);
    const emailOptions = {
      from: emailConfig.email.nodemailer,
      ...msg,
    };

    return await transporter.sendMail(emailOptions);
  }
}

module.exports = { CreateSenderSG, CreateSenderNodemailer };
