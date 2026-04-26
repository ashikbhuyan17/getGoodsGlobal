'use client';

import Link from 'next/link';
import { LogIn, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/lib/fetcher';

const tileClassName =
  'flex w-full flex-col items-center gap-1 rounded-xl bg-gray-100 p-2.5 text-center transition hover:bg-gray-200';

export default function BottomNavAuthTile({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <Link href="/signin" prefetch className={tileClassName}>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-primary">
          <LogIn className="h-5 w-5" strokeWidth={2} aria-hidden />
        </span>
        <span className="text-[11px] font-medium leading-tight">Sign in</span>
      </Link>
    );
  }

  const handleSignOut = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const logoutData: any = await fetcher('/logout', { method: 'POST' });
    if (logoutData?.status) {
      router.refresh();
      router.push('/');
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className={tileClassName}
      aria-label="Sign out"
    >
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-primary">
        <LogOut className="h-5 w-5" strokeWidth={2} aria-hidden />
      </span>
      <span className="text-[11px] font-medium leading-tight">Sign out</span>
    </button>
  );
}
