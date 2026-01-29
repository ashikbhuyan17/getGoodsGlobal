"use client";

import { User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

function SigninBtn() {
  const pathname = usePathname();
  const router = useRouter();

  const handlePush = () => {
    if (pathname === "/signin") {
      return;
    } else {
      router.push("/signin");
    }
  };

  return (
    <button
      onClick={handlePush}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary hover:bg-gray-100"
    >
      <User className="h-5 w-5" />
    </button>
  );
}

export default SigninBtn;
