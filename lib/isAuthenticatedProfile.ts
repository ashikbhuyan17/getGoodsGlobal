/** True when `/user-profile` returned a logged-in user (phone-only accounts may have `email: null`). */
export function isAuthenticatedProfile(profile: unknown): boolean {
  const data = (
    profile as { data?: { id?: unknown; email?: unknown; phone?: unknown } }
  )?.data;
  if (!data || typeof data !== 'object') return false;
  const id = data.id;
  if (id !== undefined && id !== null && String(id).length > 0) return true;
  return Boolean(data.email) || Boolean(data.phone);
}
