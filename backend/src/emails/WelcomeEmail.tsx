import * as React from 'react';
import { APP_URL, EmailLayout, Paragraph, colors } from './EmailLayout';

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => {
  return (
    <EmailLayout
      preview="Sua conta está ativa. Prepare a pipoca!"
      heading={`Bem-vindo ao TopFlop, ${name}!`}
      action={{ label: 'Acessar o TopFlop', href: APP_URL }}
      footer="Você recebeu este e-mail porque criou uma conta no TopFlop."
    >
      <Paragraph>
        Sua conta está ativa. A partir de agora você pode publicar reviews, montar sua lista de filmes para assistir e seguir outros cinéfilos.
      </Paragraph>
      <Paragraph>
        E no fim do ano, escolha o seu <span style={{ color: colors.top, fontWeight: 600 }}>Top</span> e o seu{' '}
        <span style={{ color: colors.flopLight, fontWeight: 600 }}>Flop</span>.
      </Paragraph>
    </EmailLayout>
  );
};
