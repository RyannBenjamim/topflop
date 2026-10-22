import * as React from 'react';
import { APP_URL, EmailLayout, Paragraph } from './EmailLayout';

export const EmailVerificationTemplate = ({ name, token }: { name: string; token: string }) => {
  const url = `${APP_URL}/verificar-email?token=${token}`;

  return (
    <EmailLayout
      preview="Confirme seu e-mail para começar a avaliar filmes no TopFlop."
      heading={`Falta pouco, ${name || 'cinéfilo'}!`}
      action={{ label: 'Confirmar e-mail', href: url }}
      note="Este link expira em 3 horas."
      footer="Se você não criou uma conta no TopFlop, pode ignorar este e-mail."
    >
      <Paragraph>
        Obrigado por se cadastrar no TopFlop. Confirme seu endereço de e-mail para ativar sua conta e começar a publicar reviews.
      </Paragraph>
    </EmailLayout>
  );
};
