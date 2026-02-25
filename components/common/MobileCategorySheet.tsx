/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Sidebar2 from './Sidebar2';

export default function MobileCategorySheet({
  menuCategories,
  settings,
  contact,
}: {
  menuCategories: any;
  settings: any;
  contact: any;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button type="button" className="flex flex-col items-center" aria-label="Open category menu">
          <Menu className="h-5 w-5" />
          <span>Category</span>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="h-full w-full bg-white text-foreground flex flex-col overflow-y-auto px-1 py-5">
          <Sidebar2
            settings={settings}
            contact={contact}
            initialCategories={menuCategories}
            embedded
            onClose={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
