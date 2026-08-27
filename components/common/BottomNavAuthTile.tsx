'use client';

import Link from 'next/link';
import { LogIn, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/lib/fetcher';
import { deleteToken } from '@/action/token';
import { SheetClose } from '@/components/ui/sheet';

const tileClassName =
  'flex w-full flex-col items-center gap-1 rounded-xl bg-gray-100 p-2.5 text-center transition hover:bg-gray-200';

export default function BottomNavAuthTile({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <SheetClose asChild>
        <Link href="/signin" prefetch className={tileClassName}>
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-primary">
            <LogIn className="h-5 w-5" strokeWidth={2} aria-hidden />
          </span>
          <span className="text-[11px] font-medium leading-tight">Sign in</span>
        </Link>
      </SheetClose>
    );
  }

  const handleSignOut = async () => {
    router.replace('/');

    await Promise.allSettled([
      fetcher('/logout', { method: 'POST' }),
      deleteToken(),
    ]);

    router.refresh();
  };

  return (
    <SheetClose asChild>
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
    </SheetClose>
  );
}
