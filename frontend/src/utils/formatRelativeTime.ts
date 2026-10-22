export const formatRelativeTime = (date: string): string => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'agora';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `há ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} h`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `há ${days} ${days === 1 ? 'dia' : 'dias'}`;

  return new Date(date).toLocaleDateString('pt-BR');
}
