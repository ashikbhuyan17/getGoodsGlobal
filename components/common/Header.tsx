import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import SearchBar from './SearchBar';
import HeaderNavActions from './HeaderNavActions';

export default function Header({
  settings,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: any;
}) {
  const data = settings;

  return (
    <header className="fixed top-0 left-0 z-40 flex h-16 w-full items-center bg-[#219F9B] px-2 text-primary-foreground sm:px-4 md:left-56 md:w-[calc(100%-14rem)] md:px-3 min-[1152px]:h-20 min-[1152px]:px-6">
      <div className="mx-auto flex h-full w-full min-w-0 items-center justify-between gap-2 sm:gap-4">
        <div className="flex shrink-0 items-center md:w-2/12">
          <Link href="/" prefetch aria-label="Go to homepage" className="flex items-center">
            <Image
              alt="Logo"
              src={`${process.env.NEXT_PUBLIC_IMG_URL}/${data?.data?.white_logo}`}
              width={200}
              height={64}
              className="h-8 w-auto max-w-[108px] object-contain object-left sm:h-10 sm:max-w-[160px] md:max-lg:h-9 md:max-lg:max-w-[140px] lg:h-12 lg:max-w-[180px]"
              priority
              sizes="(max-width: 639px) 108px, (max-width: 1023px) 140px, 180px"
            />
          </Link>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-3 md:max-w-2/6">
          <Suspense
            fallback={
              <div className="h-10 w-full max-w-xl animate-pulse rounded-full bg-white/20" />
            }
          >
            <SearchBar />
          </Suspense>
        </div>

        <HeaderNavActions />
      </div>
    </header>
  );
}
