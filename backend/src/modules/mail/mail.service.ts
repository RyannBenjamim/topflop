import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { render } from '@react-email/components';
import * as React from 'react';

import { EmailVerificationTemplate } from '../../emails/EmailVerification';
import { WelcomeEmail } from '../../emails/WelcomeEmail';
import { PasswordResetTemplate } from '../../emails/PasswordReset';

@Injectable()
export class MailService {
  private resend: Resend;
  private readonly logger = new Logger(MailService.name);
  private readonly fromEmail = 'TopFlop <noreply@topflop.comenio.online>'; 

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  private async send({ to, subject, email }: { to: string; subject: string; email: React.ReactElement }) {
    // Enviar só HTML, sem versão em texto puro, é um sinal de spam para Gmail/Outlook.
    const [html, text] = await Promise.all([render(email), render(email, { plainText: true })]);

    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [to],
        subject,
        html,
        text,
      });

      if (error) {
        if (error.name === 'validation_error') {
          throw new BadRequestException(error.message);
        }

        throw new InternalServerErrorException('Serviço de e-mail indisponível no momento.');
      }

      return data;
    } catch (error) {
      this.logger.error(`Failed to send e-mail: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }

  async sendEmailVerification(to: string, name: string, token: string) {
    const email = React.createElement(EmailVerificationTemplate, { name, token });
    return this.send({ to, subject: 'Confirme seu endereço de e-mail', email });
  }

  async sendWelcome(to: string, name: string) {
    const email = React.createElement(WelcomeEmail, { name });
    return this.send({ to, subject: 'Bem-vindo ao TopFlop!', email });
  }

  async sendPasswordReset(to: string, name: string, token: string) {
    const email = React.createElement(PasswordResetTemplate, { name, token });
    return this.send({ to, subject: 'Redefinição de senha do TopFlop', email });
  }
}