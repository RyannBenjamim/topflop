const messages: Record<string, string> = {
  'This value already exists.': 'Esse registro já existe.',
  'Record not found.': 'Registro não encontrado.',
  'Relationship validation failed.': 'Não foi possível relacionar os dados informados.',
  'Required field missing.': 'Preencha todos os campos obrigatórios.',
  'Access denied, an authorization token is required.': 'Faça login para continuar.',
  'Invalid user token.': 'Sua sessão não é mais válida. Entre novamente.',
  'Token expired.': 'Sua sessão expirou. Entre novamente.',
  'Invalid token.': 'Sua sessão não é mais válida. Entre novamente.',
  'You cannot follow yourself.': 'Você não pode seguir a si mesmo.',
  'You are not following this user.': 'Você não segue esse usuário.',
  'You can only update your own comments.': 'Você só pode editar os seus comentários.',
  'You can only delete your own comments.': 'Você só pode excluir os seus comentários.',
  'An internal server error has occurred.': 'Ocorreu um erro no servidor. Tente novamente.',
}

export const translateApiMessage = (message: unknown): string => {
  if (Array.isArray(message)) return message.map(translateApiMessage).join(' ');
  if (typeof message !== 'string' || !message) return 'Não foi possível concluir a ação.';
  return messages[message] ?? message;
}
