export function normalizeStatusKey(status: string) {
  return String(status || '')
    .toLowerCase()
    .trim()
    .replace(/_/g, '-')
    .replace(/\s+/g, '-');
}

/** Badge colors from order status display name. */
export function getOrderStatusStyle(statusName: string) {
  const key = normalizeStatusKey(statusName);
  if (key === 'in-review' || key.includes('review') || key.includes('partial'))
    return 'bg-blue-100 text-blue-700';
  if (key === 'confirmed' || key.includes('confirm'))
    return 'bg-green-100 text-green-700';
  if (key === 'dispatched' || key.includes('dispatch'))
    return 'bg-yellow-100 text-yellow-700';
  if (key.includes('pending')) return 'bg-yellow-100 text-yellow-700';
  if (key.includes('paid') || key.includes('complete') || key.includes('deliver'))
    return 'bg-green-100 text-green-700';
  if (key.includes('cancel')) return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-700';
}
