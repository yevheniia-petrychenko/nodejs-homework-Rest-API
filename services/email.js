const Mailgen = require('mailgen');
require('dotenv').config();

class EmailService {
  constructor(env, sender) {
    this.sender = sender;
    switch (env) {
      case 'development':
        this.link = 'http://localhost:3000';
        break;

      case 'production':
        this.link = 'link for prod';
        break;

      default:
        this.link = 'http://localhost:3000';
        break;
    }
  }
  #createTemplateVerifyEmail(token, name) {
    const mailGenerator = new Mailgen({
      theme: 'neopolitan',
      product: {
        name: 'System contacts app',
        link: this.link,
      },
    });
    const email = {
      body: {
        name: 'John Appleseed',
        intro:
          "Welcome to System contacts app! We're very excited to have you on board.",
        action: {
          instructions:
            'To get started with System contacts app, please click here:',
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Confirm your account',
            link: `${this.link}/api/users/verify/${token}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    return mailGenerator.generate(email);
  }
  async sendVerifyPasswordEmail(token, email, name) {
    const emailBody = this.#createTemplateVerifyEmail(token, name);
    const result = await this.sender.send({
      to: email,
      subject: 'Verify your account',
      html: emailBody,
    });
    console.log(result);
  }
}

module.exports = EmailService;
