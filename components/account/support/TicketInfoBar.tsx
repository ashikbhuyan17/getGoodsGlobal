"use client";

import { useRouter } from "next/navigation";

export default function TicketInfoBar({ ticketId }: { ticketId: string }) {
  const router = useRouter();

  const handleBack = () => {
    router.push("/account/support");
  };

  return (
    <div className="flex items-center justify-between border p-3 bg-white shadow-sm w-full mt-[10px] md:mt-[-6.5px]">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          aria-label="Back to support"
          className="rounded-full w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </button>
        <div>
          <h2 className="text-base md:text-lg font-semibold text-gray-900">
            {ticketId}
          </h2>
        </div>
      </div>
    </div>
  );
}
