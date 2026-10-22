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
  private readonly fromEmail = 'TopFlop <noreply@comenio.online>'; 

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  private async send({ to, subject, html }: { to: string; subject: string; html: string }) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [to],
        subject,
        html,
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
    const html = await render(React.createElement(EmailVerificationTemplate, { name, token }));
    return this.send({ to, subject: 'Confirme seu endereço de e-mail', html });
  }

  async sendWelcome(to: string, name: string) {
    const html = await render(React.createElement(WelcomeEmail, { name }));
    return this.send({ to, subject: 'Bem-vindo ao TopFlop!', html });
  }

  async sendPasswordReset(to: string, name: string, token: string) {
    const html = await render(React.createElement(PasswordResetTemplate, { name, token }));
    return this.send({ to, subject: 'Recuperação de Senha', html });
  }
}