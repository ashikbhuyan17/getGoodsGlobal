export const RESET_LOGIN_KEY = 'resetPasswordLogin';
export const RESET_OTP_COOLDOWN_UNTIL_KEY = 'resetPasswordOtpCooldownUntil';
export const RESEND_COOLDOWN_SEC = 120;

export function formatOtpCooldown(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

export function getOtpCooldownRemaining(): number {
  if (typeof window === 'undefined') return 0;

  const until = sessionStorage.getItem(RESET_OTP_COOLDOWN_UNTIL_KEY);
  if (!until) return 0;

  const remaining = Math.ceil((Number(until) - Date.now()) / 1000);
  return remaining > 0 ? remaining : 0;
}

export function startOtpCooldown() {
  const until = Date.now() + RESEND_COOLDOWN_SEC * 1000;
  sessionStorage.setItem(RESET_OTP_COOLDOWN_UNTIL_KEY, String(until));
  return RESEND_COOLDOWN_SEC;
}

export function clearResetPasswordStorage() {
  sessionStorage.removeItem(RESET_LOGIN_KEY);
  sessionStorage.removeItem(RESET_OTP_COOLDOWN_UNTIL_KEY);
}
