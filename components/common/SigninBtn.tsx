"use client";

import { User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetcher } from "@/lib/fetcher";

function SigninBtn() {
  const pathname = usePathname();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userData: any = await fetcher("/user-profile");
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
      router.push("/account");
    } else {
      if (pathname === "/signin") {
        return;
      } else {
        router.push("/signin");
      }
    }
  };

  if (loading) {
    return (
      <button
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary hover:bg-gray-100 transition-all"
        disabled
      >
        <User className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={handlePush}
      className={`flex h-10 items-center gap-2 rounded-full bg-white text-primary hover:bg-gray-100 transition-all shadow-sm hover:shadow-md ${
        user?.data?.name ? "px-3 md:px-4" : "w-10 justify-center"
      }`}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <User className="h-4 w-4 text-primary" />
      </div>
      {user?.data?.name && (
        <span className="text-sm font-semibold text-gray-800 max-w-[120px] truncate">
          {user.data.name}
        </span>
      )}
    </button>
  );
}

export default SigninBtn;
