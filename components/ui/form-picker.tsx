'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckIcon, ChevronDownIcon, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type FormPickerOption = {
  value: string;
  label: string;
};

type FormPickerProps = {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: FormPickerOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  className?: string;
};

export function FormPicker({
  id,
  value,
  onValueChange,
  options,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  disabled = false,
  searchable = true,
  className,
}: FormPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && searchable) {
      const timer = window.setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [open, searchable]);

  const sortedOptions = useMemo(
    () =>
      [...options].sort((a, b) =>
        a.label.localeCompare(b.label, 'en', { sensitivity: 'base' }),
      ),
    [options],
  );

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return sortedOptions;
    return sortedOptions.filter((option) =>
      option.label.toLowerCase().includes(query),
    );
  }, [sortedOptions, search]);

  const selected = sortedOptions.find((option) => option.value === value);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) setSearch('');
  };

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setOpen(false);
    setSearch('');
  };

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger
        id={id}
        disabled={disabled}
        className={cn(
          'border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      >
        <span className={cn('truncate', !selected && 'text-muted-foreground')}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDownIcon
          className={cn(
            'size-4 shrink-0 opacity-50 transition-transform',
            open && 'rotate-180',
          )}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="bottom"
        sideOffset={6}
        avoidCollisions
        collisionPadding={{ top: 68, bottom: 108 }}
        className="z-120 flex w-(--radix-popper-anchor-width) flex-col overflow-hidden rounded-lg border-border/80 p-0 shadow-lg max-h-[min(14rem,var(--radix-dropdown-menu-content-available-height))]! data-[side=top]:flex-col-reverse"
        onCloseAutoFocus={(event) => event.preventDefault()}
        onKeyDown={(event) => {
          if (event.target instanceof HTMLInputElement) {
            event.stopPropagation();
          }
        }}
      >
        {searchable && (
          <div className="shrink-0 bg-muted/40 px-2 py-1.5 in-data-[side=top]:border-t in-data-[side=bottom]:border-b">
            <div
              className="relative"
              onPointerDown={(event) => {
                event.preventDefault();
                searchInputRef.current?.focus();
              }}
            >
              <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={searchPlaceholder}
                className="h-7 w-full rounded-md border-0 bg-background py-0 pl-7 pr-2 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-0 focus-visible:ring-0"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                onKeyDown={(event) => event.stopPropagation()}
                onKeyUp={(event) => event.stopPropagation()}
              />
            </div>
          </div>
        )}
        <div className="min-h-0 max-h-[11.25rem] overflow-y-auto overscroll-contain p-1">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-3 text-sm text-muted-foreground">
              No results found
            </div>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = value === option.value;
              return (
                <DropdownMenuItem
                  key={option.value}
                  className={cn(
                    'flex h-9 min-h-9 cursor-pointer items-center justify-between gap-2 rounded-md px-2.5 text-sm transition-colors',
                    'hover:bg-primary/10 focus:bg-primary/10 data-[highlighted]:bg-primary/10',
                    isSelected &&
                      'bg-primary/10 font-medium text-primary hover:bg-primary/15 focus:bg-primary/15 data-[highlighted]:bg-primary/15',
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected ? (
                    <CheckIcon className="size-4 shrink-0 text-primary" />
                  ) : null}
                </DropdownMenuItem>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
