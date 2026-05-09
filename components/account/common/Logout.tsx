"use client";

import { fetcher } from "@/lib/fetcher";
import { deleteToken } from "@/action/token";
import { Power } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Logout() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleDelete = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    // Navigate immediately for a snappier logout UX.
    router.replace("/");

    const [logoutResult, deleteTokenResult] = await Promise.allSettled([
      fetcher("/logout", { method: "POST" }),
      deleteToken(),
    ]);

    if (logoutResult.status === "rejected") {
      console.log("Logout API error:", logoutResult.reason);
    }
    if (deleteTokenResult.status === "rejected") {
      console.log("Delete token error:", deleteTokenResult.reason);
    }

    router.refresh();
    setIsLoggingOut(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isLoggingOut}
      className="flex flex-col items-center gap-1 px-3 py-2 rounded text-gray-700 hover:text-teal-600 transition-colors whitespace-nowrap"
    >
      <Power className="h-6 w-6" />
      <span className="text-xs font-medium">Logout</span>
    </button>
  );
}

export default Logout;
