import * as nodemailer from 'nodemailer';
import { config } from '@core/config/nodemailer';
import ejs from 'ejs';
import fs from 'fs';

class Mail {
  constructor(
    public to?: string,
    public subject?: string,
    public message?: string,
    public name?: string,
    public templateUrl?: string,
    public code?: number,
  ) {}

  makeEmailTemplate() {
    const template = fs.readFileSync(
      this.templateUrl || 'src/core/templates/email/default.ejs',
      { encoding: 'utf-8' },
    );
    this.message = ejs.render(template, {
      name: this.name,
      code: this.code,
    });
  }

  async sendMail() {
    const mailOptions = {
      from: config.user,
      to: this.to,
      subject: this.subject,
      html: this.message,
    };

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: true,
      // name: config.user,
      auth: {
        user: config.user,
        pass: config.password,
      },
      tls: { rejectUnauthorized: true },
    });

    transporter.sendMail(mailOptions, function (error) {
      if (error) {
        console.log(error);
        return error;
      } else {
        console.log('Email enviado com sucesso.');
        return 'E-mail enviado com sucesso!';
      }
    });
  }
}

export default Mail;
