'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ResinCalculatorTopBar() {
  return (
    <div className="w-full px-2 pt-2 pb-1 sm:px-4 md:px-6 md:pt-3 md:mt-[-5px]">
      <Link
        href="/"
        aria-label="Go back to home"
        className="group inline-flex items-center gap-2.5 rounded-full bg-transparent py-1.5 pl-0 pr-2 text-sm font-medium text-gray-600 transition-colors hover:text-primary"
      >
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.25} />
        </span>
        Back
      </Link>
    </div>
  );
}
