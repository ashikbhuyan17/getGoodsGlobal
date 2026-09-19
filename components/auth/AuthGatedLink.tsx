'use client';

import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useNavCounts } from '@/hooks/useNavCounts';
import { openSignInModal } from '@/lib/openSignIn';

type AuthGatedLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
  children: ReactNode;
};

export default function AuthGatedLink({
  href,
  children,
  className,
  ...rest
}: AuthGatedLinkProps) {
  const router = useRouter();
  const { isLoggedIn, loading } = useNavCounts();

  if (loading) {
    return (
      <span className={className} aria-busy="true">
        {children}
      </span>
    );
  }

  if (!isLoggedIn) {
    return (
      <button
        type="button"
        className={className}
        onClick={() => {
          openSignInModal(router, href);
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <Link href={href} className={className} prefetch {...rest}>
      {children}
    </Link>
  );
}
