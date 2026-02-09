import { ShoppingBag, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { fetcher } from "@/lib/fetcher";
import SearchBar from "./SearchBar";
import SigninBtn from "./SigninBtn";

export default async function Header() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await fetcher(`/settings`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wishlist: any = null;
  try {
    wishlist = await fetcher("/wishlists");
  } catch {
    // Handle error gracefully
  }
  const wishlistCount = wishlist?.status === 'error' || !wishlist?.data ? 0 : wishlist.data.length;

  return (
    <header className="bg-[#edd7c4] text-primary-foreground z-40 px-4 py-1 md:px-6 fixed top-0 w-full">
      <div className="mx-auto flex items-center justify-between gap-4 md:pl-16">
        {/* Logo */}
        <div className="flex md:ml-40 items-center gap-2 whitespace-nowrap">
          \
          <Link href="/" prefetch>
            <Image
              alt="Logo"
              src={`${process.env.NEXT_PUBLIC_IMG_URL}/${data?.data?.white_logo}`}
              width={1200}
              height={1200}
              className="w-16"
            />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex flex-1 items-center gap-3 md:max-w-md">
          <SearchBar />
        </div>

        {/* Right Icons */}
        <div className="hidden md:flex items-center gap-1 md:gap-3">
          <Link prefetch href="/cart">
            <button className="flex md:h-10 w-10 items-center justify-center rounded-full bg-white text-primary hover:bg-gray-100">
              <ShoppingBag className="h-5 w-5" />
            </button>
          </Link>
          <Link prefetch href="/wishlist">
            <button className="relative flex md:h-10 w-10 items-center justify-center rounded-full bg-white text-primary hover:bg-gray-100">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </button>
          </Link>



          <SigninBtn />
        </div>
      </div>
    </header>
  );
}
