'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  GridIcon,
  ShoppingCart,
  Settings,
  CreditCard,
  Headphones,
  Truck,
  Star,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logout from './Logout';
import { useEffect, useState } from 'react';
import { fetcher } from '@/lib/fetcher';

interface UserData {
  data?: {
    name?: string;
    email?: string;
    points?: number;
  };
}

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    fetcher('/user-profile').then((data: unknown) => {
      setUser(data as UserData);
    });
  }, []);

  const navItems = [
    { icon: GridIcon, label: 'Dashboard', url: '/account' },
    { icon: ShoppingCart, label: 'Orders', url: '/account/orders' },
    { icon: CreditCard, label: 'Payments', url: '/account/payments' },
    { icon: Truck, label: 'Delivery', url: '/account/delivery' },
    { icon: Headphones, label: 'Support', url: '/account/support' },
    { icon: RotateCcw, label: 'Refunds', url: '/account/refunds' },
    { icon: Settings, label: 'Settings', url: '/account/settings' },
  ];

  const isActive = (url: string) => {
    if (url === '/account') {
      return pathname === '/account';
    }
    return pathname?.startsWith(url);
  };

  const userInitials =
    user?.data?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U';

  return (
    <header className="px-2 pt-2">
      <div className="bg-white border-b border-gray-200 rounded mb-4">
        <div className="px-6 py-4">
          <div className="flex items-center max-lg:flex-col gap-5 ">
            {/* User Profile Section */}
            <div className="flex items-center justify-center max-xl:flex-col gap-2 md:gap-4 shrink-0 lg:w-1/4">
              <Avatar className="h-14 w-14 bg-gray-300 shrink-0">
                <AvatarFallback className="text-lg font-semibold text-gray-700">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="max-xl:text-center">
                <p className="font-semibold  text-base">
                  {user?.data?.name || 'User'}
                </p>
                <p className="text-sm mt-0.5">
                  {user?.data?.email || 'user@example.com'}
                </p>
                {/* Points Badge */}
                {/* <div className="mt-2 inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                  <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-medium text-gray-900">
                    {user?.data?.points || 0} Points
                  </span>
                </div> */}
              </div>
            </div>

            {/* Navigation Links Section */}
            <nav className="grid grid-cols-4 lg:grid-cols-8 gap-2 md:overflow-x-auto sm:gap-3 ml-4 w-full 2xl:w-1/2">
              {navItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <Link
                    prefetch
                    href={item.url}
                    key={item.label}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded transition-colors whitespace-nowrap ${
                      active ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <item.icon
                      className={`h-6 w-6 ${
                        active ? 'text-teal-600' : 'text-gray-700'
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        active ? 'text-teal-600' : 'text-gray-700'
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
              <Logout />
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
