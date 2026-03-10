'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function GalleryTopBar() {
  return (
    <div className="bg-white border-b shadow-sm px-4 py-3 md:mt-[-5px] flex items-center gap-3">
      <Button
        asChild
        variant="outline"
        size="icon"
        className="rounded-lg w-9 h-9 bg-gray-100 hover:bg-gray-200 border-gray-200 shrink-0"
      >
        <Link href="/" aria-label="Go back">
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </Button>
      <h1 className="text-lg font-bold text-gray-800">Sky Gallery</h1>
    </div>
  );
}
