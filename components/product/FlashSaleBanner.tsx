'use client';

import { useState, useEffect } from 'react';

interface FlashSaleBannerProps {
  flashSale: {
    flash_sale_title?: string;
    flash_sale_percentage?: string;
    flash_sale_end_date?: string;
  };
}

function useCountdown(endDate: string | undefined) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, min: 0, sec: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!endDate) return;

    const update = () => {
      const end = new Date(endDate).getTime();
      const now = Date.now();
      const diff = Math.max(0, end - now);

      if (diff <= 0) {
        setExpired(true);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const min = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const sec = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, min, sec });
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  return { ...timeLeft, expired };
}

export default function FlashSaleBanner({ flashSale }: FlashSaleBannerProps) {
  const { days, hours, min, sec, expired } = useCountdown(flashSale?.flash_sale_end_date);
  const percentage = flashSale?.flash_sale_percentage ?? '0';
  const title = flashSale?.flash_sale_title ?? `${percentage}% Sale`;

  if (expired) return null;

  return (
    <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-[#8B2B7A] via-[#9B3A8A] to-[#219F9B] px-4 py-2 2xl:py-3 flex flex-wrap items-center justify-between gap-1">
      <p className="text-white font-bold text-base sm:text-lg">
        {percentage}% {title.replace(/^\d+%\s*/i, '').trim() || 'Sale'}
      </p>
      <div className="flex gap-2 sm:gap-3">
        {[
          { value: days, label: 'Days' },
          { value: hours, label: 'Hours' },
          { value: min, label: 'Min' },
          { value: sec, label: 'Sec' },
        ].map(({ value, label }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center w-12 h-12 sm:w-12 sm:h-12 rounded-full border-2 border-white"
          >
            <span className="text-white font-bold text-sm sm:text-base leading-tight">
              {String(value).padStart(2, '0')}
            </span>
            <span className="text-white text-[10px] sm:text-xs font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
