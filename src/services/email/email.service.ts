import { Injectable, Inject } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  constructor(@Inject('MAILER') private readonly mailer: Transporter) {}

  async sendRegistrationEmail(to: string, context: any): Promise<void> {
    context.logoUrl = process.env.LOGO_URL;

    const templatePath = path.join(
      process.env.EMAIL_LAYOUTS_DIR,
      'account-registration.hbs',
    );
    const templateString = fs.readFileSync(templatePath, 'utf-8');
    const compiledTemplate = handlebars.compile(templateString);
    const html = compiledTemplate(context);

    await this.mailer.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'Account Registration',
      html,
    });
  }

  async sendActivationEmail(to: string, context: any): Promise<void> {
    context.logoUrl = process.env.LOGO_URL;

    const templatePath = path.join(
      process.env.EMAIL_LAYOUTS_DIR,
      'account-activation.hbs',
    );
    const templateString = fs.readFileSync(templatePath, 'utf-8');
    const compiledTemplate = handlebars.compile(templateString);
    const html = compiledTemplate(context);

    await this.mailer.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'Account Activation',
      html,
    });
  }

  async sendResetPasswordEmail(
    to: string,
    context: { name: string; resetLink: string; logoUrl?: string },
  ): Promise<void> {
    context.logoUrl = process.env.LOGO_URL;

    const templatePath = path.join(
      process.env.EMAIL_LAYOUTS_DIR,
      'reset-password.hbs',
    );
    const templateString = fs.readFileSync(templatePath, 'utf-8');
    const compiledTemplate = handlebars.compile(templateString);
    const html = compiledTemplate(context);

    console.log(`Sending email to: ${to}`);

    await this.mailer
      .sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: 'Password Reset',
        html,
      })
      .then(() => {
        console.log(`Email sent to: ${to}`);
      })
      .catch((error) => {
        console.error(`Error sending email to: ${to}`, error);
      });
  }
}
