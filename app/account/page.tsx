import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { fetcher } from '@/lib/fetcher';
import ProductCard from '@/components/common/ProductCard';
import StatusCards from '@/components/account/StatusCards';
import Link from 'next/link';
import { Phone } from 'lucide-react';

export default async function Dashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wishlist: any = await fetcher('/wishlists');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dashboardOverview: any = await fetcher('/dashboard-overview');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userProfile: any = await fetcher('/user-profile');

  const favoriteProducts = wishlist?.data || [];
  const firstFavoriteSlug = favoriteProducts?.[0]?.product?.slug;
  // Use the same source as Suggestions UI: related products by slug.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let recentViewProducts: any[] = [];
  if (firstFavoriteSlug) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recentRes: any = await fetcher(
      `/related-products/${firstFavoriteSlug}`,
      {},
      60,
    );
    recentViewProducts = recentRes?.data || [];
  }

  const pending = dashboardOverview?.data?.pendingOrders ?? 0;
  const processing = dashboardOverview?.data?.ProcessingOrders ?? 0;
  const completed = dashboardOverview?.data?.completeOrders ?? 0;
  const managerPhoneRaw =
    userProfile?.data?.account_manager_phone ||
    userProfile?.data?.manager_phone ||
    userProfile?.data?.phone ||
    '';
  const managerWhatsappRaw = '01827997700';
  const managerMessenger = 'https://m.me/179069901947541';
  const managerPhone = String(managerPhoneRaw || '').trim();
  const managerWhatsapp = String(managerWhatsappRaw || '').trim();
  const whatsappDigits = managerWhatsapp.replace(/[^\d]/g, '');
  const whatsappNumber = whatsappDigits.startsWith('880')
    ? whatsappDigits
    : whatsappDigits.startsWith('0')
      ? `88${whatsappDigits}`
      : whatsappDigits;
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : '#';
  const phoneHref = managerPhone ? `tel:${managerPhone}` : '#';
  const messengerHref = managerMessenger ? String(managerMessenger) : '#';

  return (
    <div className="w-full rounded space-y-4 px-2">
      {/* Status cards + Support in one div (bg, shadow); Support on right */}
      <StatusCards
        pending={pending}
        processing={processing}
        completed={completed}
        rightSlot={
          <div className="">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-2 min-w-0">
                <Image
                  src="/chat-user.svg"
                  width={56}
                  height={56}
                  alt="manager"
                  className="object-contain shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold leading-6 text-gray-900 uppercase wrap-break-word">
                    GetGoods Team
                  </p>
                  <p className="font-semibold text-cyan-700 mt-1">
                    01827997700/01827993399
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <Link
                  href={phoneHref}
                  aria-label="Call manager"
                  className="inline-flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  <Phone className="h-5 w-5" />
                </Link>
                <Link
                  href={whatsappHref}
                  target={managerWhatsapp ? '_blank' : undefined}
                  aria-label="Contact on WhatsApp"
                  className="inline-flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                >
                  <i className="fa-brands fa-whatsapp text-lg" />
                </Link>
                <Link
                  href={messengerHref}
                  target={managerMessenger ? '_blank' : undefined}
                  aria-label="Contact on Messenger"
                  className="inline-flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <i className="fa-brands fa-facebook-messenger text-base" />
                </Link>
              </div>
            </div>
            <p className="text-sm mt-2 text-gray-600 leading-relaxed">
              Hi {userProfile?.data?.name || 'there'}, I am your account
              manager, please feel free to contact me for any assistance.
            </p>
            {/* <div className="mt-4">
              <Link prefetch href="/account/support/create" className="mt-auto">
                <Button className="w-full">Get Help Now</Button>
              </Link>
            </div> */}
          </div>
        }
      />

      <div className="bg-white rounded-sm">
        {/* Favorites */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="font-semibold text-gray-800"> Favorite View</p>
            <Button variant="outline" className="h-7 text-xs px-3 rounded-lg">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {favoriteProducts?.map((item: any, i: number) => (
              <ProductCard
                title={item?.product?.name}
                slug={item?.product?.slug}
                image={item?.product?.image?.image}
                newPrice={item?.product?.new_price}
                oldPrice={item?.product?.old_price}
                key={i}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm">
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="font-semibold text-gray-800">Recent View</p>
          </div>

          {recentViewProducts?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {recentViewProducts?.map((item: any, i: number) => (
                <ProductCard
                  key={`recent-${item?.id ?? i}`}
                  title={item?.name}
                  slug={item?.slug}
                  image={item?.image?.image}
                  newPrice={item?.new_price}
                  oldPrice={item?.old_price}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No recent views found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
