'use client';

import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetcher } from '@/lib/fetcher';
import { isAuthenticatedProfile } from '@/lib/isAuthenticatedProfile';

function SigninBtn() {
  const pathname = usePathname();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userData: any = await fetcher('/user-profile');
      if (isAuthenticatedProfile(userData)) {
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch {
      // User not logged in
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Refresh user data when pathname changes (e.g., after login/logout)
  useEffect(() => {
    if (!loading) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handlePush = () => {
    if (isAuthenticatedProfile(user)) {
      router.push('/account');
    } else {
      if (pathname === '/signin') {
        return;
      } else {
        const signinUrl = `/signin?redirect=${encodeURIComponent(pathname || '/')}`;
        router.push(signinUrl);
      }
    }
  };

  if (loading) {
    return (
      <button
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary hover:bg-gray-100 transition-all"
        disabled
        aria-label="Loading"
      >
        <User className="h-5 w-5" />
      </button>
    );
  }

  const imagePath =
    typeof user?.data?.image === 'string' ? user.data.image.trim() : '';
  const headerAvatarSrc = imagePath
    ? `${(process.env.NEXT_PUBLIC_IMG_URL || '').replace(/\/+$/, '')}/${imagePath.replace(/^\/+/, '')}`
    : null;

  return (
    <button
      onClick={handlePush}
      aria-label={user?.data?.name ? 'Account menu' : 'Sign in'}
      className="flex h-10 items-center gap-2 rounded-full"
    >
      {user?.data?.name ? (
        <div className="shrink-0 rounded-full bg-white shadow-sm ring-1 ring-gray-200/80 hover:shadow-md transition-all overflow-hidden h-10 w-10">
          <Avatar className="h-10 w-10">
            {headerAvatarSrc ? (
              <AvatarImage
                src={headerAvatarSrc}
                alt={user.data.name || ''}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-white text-primary text-xl font-semibold">
              {user?.data?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center  rounded-full bg-white text-primary hover:bg-gray-100 transition-all shadow-sm hover:shadow-md  justify-center">
          <User className="h-4 w-4 text-primary" />
        </div>
      )}

      {user?.data?.name && (
        <div className="flex flex-col justify-start items-start text-gray-100">
          <p className="text-sm font-semibold max-w-[120px] truncate">
            {user.data.name}
          </p>
          <p className="text-xs font-semibold  max-w-[120px]">
            {user.data.email || user.data.phone}
          </p>
        </div>
      )}
    </button>
  );
}

export default SigninBtn;
