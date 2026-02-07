"use client";

import { fetcher } from "@/lib/fetcher";
import { Power } from "lucide-react";
import { useRouter } from "next/navigation";

function Logout() {
  const router = useRouter();

  const handleDelete = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const logoutData: any = await fetcher("/logout", { method: "POST" });
    if (logoutData?.status) {
      // Refresh the page to update auth state
      router.refresh();
      router.push("/");
      // Reload after a short delay to ensure state is updated
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="flex flex-col items-center gap-1 px-3 py-2 rounded text-gray-700 hover:text-teal-600 transition-colors whitespace-nowrap"
    >
      <Power className="h-6 w-6" />
      <span className="text-xs font-medium">Logout</span>
    </button>
  );
}

export default Logout;
