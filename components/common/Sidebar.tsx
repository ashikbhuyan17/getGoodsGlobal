"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, MessageSquare, Headphones } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Footer = ({ settings, contact }: { settings: any; contact: any }) => (
  <div className="px-3 py-6 border-t border-border mt-4">
    <div className="grid grid-cols-3 gap-1">
      <Link
        href={settings?.data?.messenger}
        target="_blank"
        className="flex flex-col items-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 0C5.24 0 0 4.952 0 11.64c0 3.499 1.434 6.521 3.769 8.61a.96.96 0 0 1 .323.683l.065 2.135a.96.96 0 0 0 1.347.85l2.381-1.053a.96.96 0 0 1 .641-.046A13 13 0 0 0 12 23.28c6.76 0 12-4.952 12-11.64S18.76 0 12 0m6.806 7.44c.522-.03.971.567.63 1.094l-4.178 6.457a.707.707 0 0 1-.977.208l-3.87-2.504a.44.44 0 0 0-.49.007l-4.363 3.01c-.637.438-1.415-.317-.995-.966l4.179-6.457a.706.706 0 0 1 .977-.21l3.87 2.505c.15.097.344.094.491-.007l4.362-3.008a.7.7 0 0 1 .364-.13"
          />
        </svg>
        <span className="text-xs font-medium">Messenger</span>
      </Link>

      <Link
        href={`https://wa.me/+88${contact?.data?.phone}`}
        target="_blank"
        className="flex flex-col items-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-xs font-medium">Chat</span>
      </Link>

      <Link
        href="/account/support"
        className="flex flex-col items-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
      >
        <Headphones className="w-5 h-5" />
        <span className="text-xs font-medium">Support</span>
      </Link>
    </div>
  </div>
);

export default function Sidebar({
  navItems,
  settings,
  contact,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navItems: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contact: any;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ---------------- DESKTOP SIDEBAR ---------------- */}
      <nav
        className={clsx(
          "fixed top-0 left-0 h-full hidden md:flex w-56 bg-white border-r border-border text-foreground flex-col justify-between z-50"
        )}
      >
        {/* NAV ITEMS */}
        <ul className="mt-4 space-y-1 flex-1">
          {navItems.map(
            ({
              name,
              slug,
              image,
            }: {
              name: string;
              slug: string;
              image: string;
            }) => (
              <li key={name}>
                <Link
                  href={`/category/${slug}`}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-primary mx-2 hover:text-primary-foreground transition-colors"
                >
                  <Image
                    alt={name}
                    src={`${process.env.NEXT_PUBLIC_IMG_URL}/${image}`}
                    width={800}
                    height={800}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="ml-3 text-sm">{name}</span>
                </Link>
              </li>
            )
          )}
        </ul>

        {/* FOOTER */}
        <Footer contact={contact} settings={settings} />
      </nav>

      {/* ---------------- MOBILE MENU BUTTON ---------------- */}
      <li className="flex flex-col items-center md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button type="button" className="flex flex-col items-center" aria-label="Open category menu">
              <Menu className="h-5 w-5" />
              <span>Category</span>
            </button>
          </SheetTrigger>

          {/* ---------------- MOBILE SLIDING SIDEBAR ---------------- */}
          <SheetContent side="left" className="w-64 p-0">
            <ul className="mt-4 space-y-1">
              {navItems.map(
                ({
                  name,
                  slug,
                  image,
                }: {
                  name: string;
                  slug: string;
                  image: string;
                }) => (
                  <li key={name}>
                    <Link
                      href={`/category/${slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center px-3 py-2 rounded-md hover:bg-primary mx-2 hover:text-primary-foreground transition-colors"
                    >
                      <Image
                        alt={name}
                        src={`${process.env.NEXT_PUBLIC_IMG_URL}/${image}`}
                        width={800}
                        height={800}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="ml-3 text-sm">{name}</span>
                    </Link>
                  </li>
                )
              )}
            </ul>
          </SheetContent>
        </Sheet>
      </li>
    </>
  );
}
