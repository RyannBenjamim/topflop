import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Link,
} from '@react-email/components';
import * as React from 'react';

export const APP_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173';

// Mesmas cores do frontend (frontend/src/styles/index.css).
export const colors = {
  background: '#121212',
  surface: '#1C1C1C',
  border: '#2E3338',
  primary: '#E8B04A',
  onPrimary: '#121212',
  text: '#F5F5F5',
  textSoft: '#A1A1AA',
  top: '#3FA968',
  flopLight: '#E58A8A',
};

interface EmailLayoutProps {
  preview: string;
  heading: string;
  children: React.ReactNode;
  action?: { label: string; href: string };
  note?: React.ReactNode;
  footer: string;
}

export const EmailLayout = ({ preview, heading, children, action, note, footer }: EmailLayoutProps) => (
  <Html lang="pt-BR">
    <Head>
      <meta name="color-scheme" content="dark" />
      <meta name="supported-color-schemes" content="dark" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Caesar+Dressing&family=Inter:wght@400;600;700&display=swap"
      />
    </Head>
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Link href={APP_URL} style={logo}>
            <span style={{ ...logoText, color: colors.primary }}>Top</span>
            <span style={{ ...logoText, color: colors.text }}>Flop</span>
          </Link>
        </Section>

        <Section style={card}>
          <Section style={accentBar} />
          <Section style={cardContent}>
            <Heading as="h1" style={headingStyle}>{heading}</Heading>

            {children}

            {action && (
              <>
                <Section style={buttonSection}>
                  <Button href={action.href} style={button}>{action.label}</Button>
                </Section>
                <Text style={fallback}>
                  Se o botão não funcionar, copie e cole este link no navegador:
                  <br />
                  <Link href={action.href} style={fallbackLink}>{action.href}</Link>
                </Text>
              </>
            )}

            {note && <Text style={noteStyle}>{note}</Text>}
          </Section>
        </Section>

        <Text style={footerText}>
          {footer}
          <br />
          © {new Date().getFullYear()} TopFlop
        </Text>
      </Container>
    </Body>
  </Html>
);

export const Paragraph = ({ children }: { children: React.ReactNode }) => (
  <Text style={paragraph}>{children}</Text>
);

const fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const main = {
  backgroundColor: colors.background,
  fontFamily,
  margin: '0',
  padding: '48px 12px',
};

const container = {
  maxWidth: '520px',
  margin: '0 auto',
};

const logoSection = {
  textAlign: 'center' as const,
  padding: '0 0 28px',
};

const logo = {
  textDecoration: 'none',
};

const logoText = {
  fontFamily: '"Caesar Dressing", Impact, "Arial Black", sans-serif',
  fontSize: '34px',
  letterSpacing: '1px',
  lineHeight: '1',
  textTransform: 'uppercase' as const,
};

const card = {
  backgroundColor: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: '14px',
  overflow: 'hidden',
};

const accentBar = {
  height: '3px',
  backgroundColor: colors.primary,
};

const cardContent = {
  padding: '36px 36px 32px',
};

const headingStyle = {
  color: colors.text,
  fontSize: '22px',
  fontWeight: '700',
  letterSpacing: '-0.01em',
  lineHeight: '1.3',
  margin: '0 0 16px',
};

const paragraph = {
  color: colors.textSoft,
  fontSize: '15px',
  lineHeight: '1.65',
  margin: '0 0 14px',
};

const buttonSection = {
  margin: '28px 0 8px',
};

const button = {
  backgroundColor: colors.primary,
  borderRadius: '8px',
  color: colors.onPrimary,
  fontSize: '15px',
  fontWeight: '600',
  letterSpacing: '0.3px',
  textDecoration: 'none',
  padding: '13px 24px',
  display: 'inline-block',
};

const fallback = {
  color: colors.textSoft,
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '24px 0 0',
  paddingTop: '20px',
  borderTop: `1px solid ${colors.border}`,
};

const fallbackLink = {
  color: colors.primary,
  wordBreak: 'break-all' as const,
};

const noteStyle = {
  color: colors.textSoft,
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '16px 0 0',
};

const footerText = {
  color: '#6B6B73',
  fontSize: '12px',
  lineHeight: '1.6',
  textAlign: 'center' as const,
  margin: '24px 0 0',
};
