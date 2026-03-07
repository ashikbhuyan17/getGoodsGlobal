import { ShoppingBag, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { fetcher } from '@/lib/fetcher';
import SearchBar from './SearchBar';
import SigninBtn from './SigninBtn';

export default async function Header({
  settings,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: any;
}) {
  const data = settings;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wishlist: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cartProducts: any = null;
  try {
    [wishlist, cartProducts] = await Promise.all([
      fetcher('/wishlists'),
      fetcher('/cart-products'),
    ]);
  } catch {
    // Handle error gracefully
  }
  const wishlistCount =
    wishlist?.status === 'error' || !wishlist?.data ? 0 : wishlist.data.length;
  const cartCount = cartProducts?.data?.length ?? 0;

  return (
    <header className="bg-[#219F9B] text-primary-foreground z-40 px-4 py-[16px] md:py-[13px] md:px-6 fixed top-0 w-full md:w-[calc(100%-14rem)] md:ml-56">
      <div className="mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex  items-center gap-2 whitespace-nowrap md:w-2/12">
          <Link href="/" prefetch aria-label="Go to homepage">
            <Image
              alt="Logo"
              src={`${process.env.NEXT_PUBLIC_IMG_URL}/${data?.data?.white_logo}`}
              width={200}
              height={64}
              className="h-10 w-auto max-w-[180px] object-contain md:h-12 md:max-w-[200px]"
              priority
            />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex flex-1 items-center gap-3 md:max-w-2/6">
          <SearchBar />
        </div>

        {/* Right Icons */}
        <div className="hidden md:flex items-center justify-end gap-1 md:gap-3 md:w-2/6 md:pr-10">
          <Link
            prefetch
            href="/cart"
            aria-label={
              cartCount > 0 ? `View cart (${cartCount} items)` : 'View cart'
            }
            className="relative flex md:h-10 w-10 items-center justify-center rounded-full bg-white text-primary hover:bg-gray-100"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
          <Link
            prefetch
            href="/wishlist"
            aria-label={
              wishlistCount > 0
                ? `View wishlist (${wishlistCount} items)`
                : 'View wishlist'
            }
            className="relative flex md:h-10 w-10 items-center justify-center rounded-full bg-white text-primary hover:bg-gray-100"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>
          <SigninBtn />
        </div>
      </div>
    </header>
  );
}
