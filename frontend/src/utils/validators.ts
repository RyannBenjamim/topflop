import type { ReviewFormValues } from "../types/reviews";

const usernamePattern = /^[a-zA-Z0-9_]+$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): string => {
  if (!email.trim()) return 'Informe o e-mail.';
  if (!emailPattern.test(email.trim())) return 'Informe um e-mail válido.';
  return '';
}

export const validatePassword = (password: string): string => {
  if (!password) return 'Informe a senha.';
  if (password.length < 6) return 'A senha deve ter ao menos 6 caracteres.';
  return '';
}

export const validateUsername = (username: string): string => {
  const value = username.trim();
  if (value.length < 3 || value.length > 30) return 'O usuário deve ter entre 3 e 30 caracteres.';
  if (!usernamePattern.test(value)) return 'Use apenas letras, números e _ (sem espaços ou acentos).';
  return '';
}

export const validateName = (name: string): string => {
  const value = name.trim();
  if (value.length < 3 || value.length > 50) return 'O nome deve ter entre 3 e 50 caracteres.';
  return '';
}

export const validateNameUpdate = (name: string): string => {
  const lengthError = validateName(name);
  if (lengthError) return lengthError;
  if (!usernamePattern.test(name.trim())) {
    return 'Para alterar o nome, a API aceita apenas letras, números e _ (sem espaços ou acentos).';
  }
  return '';
}

export const validateBio = (bio: string): string => {
  if (!bio.trim()) return 'A API não aceita bio vazia.';
  if (bio.trim().length > 300) return 'A bio pode ter no máximo 300 caracteres.';
  return '';
}

export type ReviewFormErrors = Partial<Record<keyof ReviewFormValues, string>>;

export const validateReview = ({ title, content, topPercentage }: ReviewFormValues): ReviewFormErrors => {
  const errors: ReviewFormErrors = {};
  const titleLength = title.trim().length;
  const contentLength = content.trim().length;

  if (titleLength < 3 || titleLength > 120) errors.title = 'O título deve ter entre 3 e 120 caracteres.';
  if (contentLength < 20 || contentLength > 5000) errors.content = 'A review deve ter entre 20 e 5000 caracteres.';
  if (!Number.isInteger(topPercentage) || topPercentage < 1 || topPercentage > 100) {
    errors.topPercentage = 'Escolha uma nota de 1 a 100.';
  }

  return errors;
}

export const validateComment = (content: string): string => {
  const length = content.trim().length;
  if (length < 1) return 'Escreva algo antes de comentar.';
  if (length > 500) return 'O comentário pode ter no máximo 500 caracteres.';
  return '';
}
