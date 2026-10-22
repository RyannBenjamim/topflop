import * as React from 'react';
import { APP_URL, EmailLayout, Paragraph } from './EmailLayout';

export const PasswordResetTemplate = ({ name, token }: { name: string; token: string }) => {
  const url = `${APP_URL}/redefinir-senha?token=${token}`;

  return (
    <EmailLayout
      preview="Recebemos um pedido para redefinir sua senha."
      heading={`Olá, ${name}!`}
      action={{ label: 'Redefinir senha', href: url }}
      note="Este link expira em 1 hora."
      footer="Se você não pediu para redefinir sua senha, ignore este e-mail. Sua senha continua a mesma."
    >
      <Paragraph>
        Recebemos um pedido para redefinir a senha da sua conta no TopFlop. Clique no botão abaixo para escolher uma nova senha.
      </Paragraph>
    </EmailLayout>
  );
};
