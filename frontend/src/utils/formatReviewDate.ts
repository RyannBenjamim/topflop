export const formatReviewDate = (
  createdAt: string | Date,
  type: 0 | 1
): string => {
  const date = new Date(createdAt);

  if (type === 1) {
    const months = [
      'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
      'jul', 'ago', 'set', 'out', 'nov', 'dez'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2, '0');

    return `${hour}:${minute} · ${day} de ${month} de ${year}`;
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 1) return 'agora';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  if (weeks < 4) return `${weeks}sem`;
  if (months < 12) return `${months}mês`;
  return `${years}a`;
}
