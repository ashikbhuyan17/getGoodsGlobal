'use client';

import { User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetcher } from '@/lib/fetcher';

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
      if (userData?.data?.email) {
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
    if (user?.data?.email) {
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

  return (
    <button
      onClick={handlePush}
      aria-label={user?.data?.name ? "Account menu" : "Sign in"}
      className={`flex h-10 items-center gap-2 rounded-full "
        }`}
    >
      {user?.data?.name ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-primary hover:bg-gray-100 transition-all shadow-sm hover:shadow-md">
          <span className="text-xl font-semibold">
            {user?.data?.name?.charAt(0).toUpperCase()}
          </span>
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
            {user.data.email}
          </p>
        </div>
      )}
    </button>
  );
}

export default SigninBtn;
