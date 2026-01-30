import { ShoppingBag, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { fetcher } from "@/lib/fetcher";
import SearchBar from "./SearchBar";
import SigninBtn from "./SigninBtn";

export default async function Header() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await fetcher(`/settings`);

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
            <button className="flex md:h-10 w-10 items-center justify-center rounded-full bg-white text-primary hover:bg-gray-100">
              <Heart className="h-5 w-5" />
            </button>
          </Link>



          <SigninBtn />
        </div>
      </div>
    </header>
  );
}
