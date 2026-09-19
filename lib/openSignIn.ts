import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export function buildSignInUrl(redirectPath: string): string {
  const path =
    redirectPath.startsWith('/') && !redirectPath.startsWith('//')
      ? redirectPath
      : '/';
  return `/signin?redirect=${encodeURIComponent(path)}`;
}

/** Client navigation — opens intercepting sign-in modal when supported. */
export function openSignInModal(
  router: AppRouterInstance,
  redirectPath: string,
): void {
  router.push(buildSignInUrl(redirectPath));
}
