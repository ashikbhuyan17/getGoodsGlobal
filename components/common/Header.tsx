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
    <header className="fixed top-0 left-0 z-40 flex h-16 w-full items-center bg-[#219F9B] px-4 text-primary-foreground md:left-56 md:h-20 md:w-[calc(100%-14rem)] md:px-6">
      <div className="mx-auto flex h-full w-full items-center justify-between gap-4">
        <div className="flex items-center gap-2 whitespace-nowrap md:w-2/12">
          <Link href="/" prefetch aria-label="Go to homepage">
            <Image
              alt="Logo"
              src={`${process.env.NEXT_PUBLIC_IMG_URL}/${data?.data?.white_logo}`}
              width={200}
              height={64}
              className="h-10 w-auto max-w-[180px] object-contain md:h-12 md:max-w-[200px]"
              priority
              sizes="(max-width: 768px) 140px, 180px"
            />
          </Link>
        </div>

        <div className="flex flex-1 items-center gap-3 md:max-w-2/6">
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
