import type { Metadata } from 'next';
import { Jost } from 'next/font/google';
import './globals.css';
// import Sidebar from "@/components/common/Sidebar";
import Header from '@/components/common/Header';
import { fetcher } from '@/lib/fetcher';
import { REVALIDATE_CATALOG } from '@/lib/utils';
import { Toaster } from 'sonner';
import BottomNav from '@/components/common/BottomNav';
import Sidebar2 from '@/components/common/Sidebar2';

const jost = Jost({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'GetGoods',
    template: '%s | GetGoods',
  },
  description:
    'GetGoods — discover products, easy ordering, and reliable delivery.',
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const [settings, contact, menuCategoriesRes] = await Promise.all([
    fetcher(`/settings`, {}, REVALIDATE_CATALOG, false),
    fetcher(`/contact`, {}, REVALIDATE_CATALOG, false),
    fetcher('/menu-categories', {}, REVALIDATE_CATALOG, false).catch(() => null),
  ]);
  const menuCategories = menuCategoriesRes ?? null;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          integrity="sha512-..."
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body
        className={`${jost.className} flex bg-background overflow-x-hidden`}
        suppressHydrationWarning
      >
        <div className="hidden md:flex">
          {/* <Sidebar
            contact={contact}
            settings={settings}
            navItems={navItems?.data}
          /> */}
          <Sidebar2
            settings={settings}
            contact={contact}
            initialCategories={menuCategories}
          />
        </div>
        <BottomNav menuCategories={menuCategories} />
        <Header settings={settings} />
        <main className="box-border min-w-0 flex-1 w-full max-w-full overflow-x-hidden pt-16 transition-all justify-center md:pt-20 md:pl-56">
          {children}
          {modal}
          <Toaster position="bottom-right" richColors />
        </main>
      </body>
    </html>
  );
}
