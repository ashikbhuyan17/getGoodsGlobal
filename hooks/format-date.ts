export function formatDate(
  date: string | number | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }
): string {
  if (date == null) return '—';
  const d = typeof date === 'object' ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', options).format(d);
}
