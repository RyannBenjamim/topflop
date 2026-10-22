export const formatReleaseDate = (date?: string | null): string => {
  if (!date) return 'Sem data';

  const [year, month, day] = date.slice(0, 10).split('-');
  if (!year || !month || !day) return 'Sem data';

  return `${day}/${month}/${year}`;
}

export const getReleaseYear = (date?: string | null): string => {
  return date ? date.slice(0, 4) : '';
}
