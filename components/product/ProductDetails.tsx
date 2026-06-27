/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTrigger,
} from '../ui/dialog';
import { X } from 'lucide-react';
import SizeCard from './SizeCard';
import FlashSaleBanner from './FlashSaleBanner';
import { useProductStore } from '@/stores/useProductStore';
import { formatPriceInt } from '@/lib/utils';

export default function ProductDetails({
  product,
  bulkQuantities,
}: {
  product: any;
  bulkQuantities?: any;
}) {
  const p = product?.data?.product;
  const productColors = product?.data?.productColors ?? [];
  const selectedColor = useProductStore((s) => s.selectedColor);
  const selectedProductColor = productColors.find(
    (pc: any) => pc?.color?.id === selectedColor?.id,
  );
  const sizes = selectedProductColor?.sizes ?? productColors?.[0]?.sizes ?? [];
  const effectiveColorId = String(
    selectedColor?.id ?? productColors?.[0]?.color?.id ?? '',
  );
  const specification =
    selectedProductColor?.specification ?? productColors?.[0]?.specification;
  const hasSpecification = specification != null && specification !== '';
  const rawFlashSale = product?.data?.flashSale ?? null;
  const flashSale = !rawFlashSale
    ? null
    : Array.isArray(rawFlashSale)
      ? rawFlashSale.length > 0
        ? rawFlashSale[0]
        : null
      : rawFlashSale;

  const [image, setImage] = useState(
    `${process.env.NEXT_PUBLIC_IMG_URL}/${p?.image?.image}`,
  );

  const setSelectedColor = useProductStore((s) => s.setSelectedColor);
  const colorQty = useProductStore((s) => s.colorQty);
  const totalQuantity = useProductStore((s) => s.totalQuantity());
  useProductStore((s) => s.variants);

  return (
    <div className="p-2 flex flex-col xl:flex-row mt-4 gap-4 overflow-x-hidden justify-between border-border">
      {/* Left Section - Image Gallery */}
      <div className="flex gap-2 w-full flex-col xl:flex-row">
        <div className="flex lg:flex-col gap-2 order-2 lg:order-1">
          <div
            onClick={() =>
              setImage(`${process.env.NEXT_PUBLIC_IMG_URL}/${p?.image?.image}`)
            }
            className="w-17 h-17 rounded-md overflow-hidden border cursor-pointer"
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_IMG_URL}/${p?.image?.image}`}
              alt={p?.name}
              width={68}
              height={68}
              className="object-cover w-full h-full"
            />
          </div>
          {JSON.parse(p?.PostImage ?? '[]')?.map((img: string) => (
            <div
              key={img}
              onClick={() =>
                setImage(
                  `${process.env.NEXT_PUBLIC_IMG_URL}/public/images/product/slider/${img}`,
                )
              }
              className="w-16 h-16 rounded-md overflow-hidden border cursor-pointer"
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_IMG_URL}/public/images/product/slider/${img}`}
                alt={p?.name}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
        <div className="w-full order-1 lg:order-2 flex justify-center">
          <div className="group relative aspect-square w-full max-w-[350px] overflow-hidden rounded-md border sm:max-w-[400px] xl:max-w-[550px]">
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center gap-1 bg-black/40 text-sm text-white opacity-0 transition-all duration-300 hover:opacity-100"
                  aria-label="Preview product image"
                >
                  <Eye size={15} /> <span>Preview</span>
                </button>
              </DialogTrigger>

              <DialogContent
                showCloseButton={false}
                className="w-[350px] max-w-[95vw] gap-0 overflow-hidden border-0 p-0 sm:w-[400px] xl:w-[550px] xl:max-w-[90vw]"
              >
                <DialogClose className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-700 shadow-md ring-1 ring-black/5 transition hover:bg-gray-100 focus:outline-none">
                  <X size={16} />
                  <span className="sr-only">Close</span>
                </DialogClose>
                <div className="relative aspect-square w-full bg-white">
                  <Image
                    src={image}
                    alt={p?.name ?? 'Product'}
                    width={550}
                    height={550}
                    className="h-full w-full object-contain"
                    sizes="(max-width: 640px) 350px, (max-width: 1280px) 400px, 550px"
                    priority
                  />
                </div>
              </DialogContent>
            </Dialog>

            <Image
              src={image}
              alt={p?.name ?? 'Product'}
              width={550}
              height={550}
              className="h-full w-full object-contain"
              sizes="(max-width: 640px) 350px, (max-width: 1280px) 400px, 550px"
            />
          </div>
        </div>
      </div>

      {/* Right Section - Offer and Details */}
      <div className="w-full">
        <Card className="border-none shadow-none p-0">
          <CardContent className="p-0 shadow-none px-2 border-0 space-y-6">
            {bulkQuantities && (
              <div className="bg-gray-100 rounded-t-md overflow-hidden">
                <div className="grid grid-cols-3 gap-0">
                  {bulkQuantities?.data?.map((bulk: any, i: number) => {
                    if (i >= 3) return null;
                    const minQty = Number(bulk?.min_qty ?? 0);
                    // Keep first step active by default, then activate next steps cumulatively.
                    const isActive = i === 0 || totalQuantity >= minQty;
                    const tierStyles = [
                      {
                        bg: 'bg-[#E7F2EF]',
                        bar: 'bg-gradient-to-r from-blue-600 to-blue-400',
                      },
                      {
                        bg: 'bg-[#E8F4FD]',
                        bar: 'bg-gradient-to-r from-sky-600 to-sky-400',
                      },
                      {
                        bg: 'bg-[#F5F0FF]',
                        bar: 'bg-gradient-to-r from-lime-600 to-lime-400',
                      },
                    ];
                    const style = tierStyles[i] ?? {
                      bg: 'bg-gray-100',
                      bar: 'bg-gray-200',
                    };
                    const bulkFlashNum = Number(bulk?.flash_sale_price);
                    const hasBulkTierFlash =
                      Number.isFinite(bulkFlashNum) && bulkFlashNum > 0;
                    return (
                      <div
                        key={bulk?.id}
                        className={cn(
                          'relative px-4 py-6 transition-all',
                          isActive ? style.bg : 'bg-gray-100',
                        )}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="flex flex-col items-center gap-1 space-y-2">
                            <p className="text-xl font-semibold text-gray-800">
                              ৳
                              {formatPriceInt(
                                hasBulkTierFlash
                                  ? bulkFlashNum
                                  : (bulk?.price ?? 0),
                              )}
                            </p>
                            {hasBulkTierFlash ? (
                              <p className="text-sm text-gray-400 line-through">
                                ৳{formatPriceInt(bulk?.price ?? 0)}
                              </p>
                            ) : bulk?.old_price ? (
                              <p className="text-sm text-gray-400 line-through">
                                ৳{formatPriceInt(bulk.old_price)}
                              </p>
                            ) : null}
                            <p className="text-sm text-[#777]">{bulk?.title}</p>
                          </div>
                        </div>
                        <div
                          className={cn(
                            'absolute bottom-0 left-0 right-0 h-2',
                            isActive ? style.bar : 'bg-gray-200',
                          )}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {flashSale && <FlashSaleBanner flashSale={flashSale} />}

            <div>
              <p className="font-medium text-gray-700 mb-2">
                {hasSpecification ? 'Specification' : 'Color'} :{' '}
                <span className="text-primary cursor-pointer">
                  {hasSpecification
                    ? String(specification)
                    : (selectedColor?.colorName ??
                      productColors?.[0]?.color?.colorName)}
                </span>
              </p>
              <div className="flex relative flex-wrap gap-3">
                {productColors?.map((color: any) => (
                  <div
                    key={color?.color?.id}
                    onClick={() => {
                      setSelectedColor(color?.color);
                      setImage(
                        `${process.env.NEXT_PUBLIC_IMG_URL}/${color?.Image}`,
                      );
                    }}
                    className="w-14 h-14 rounded-md overflow-hidden cursor-pointer"
                  >
                    {(() => {
                      const qty = colorQty(String(color?.color?.id ?? ''));
                      return qty > 0 ? (
                        <span
                          className={cn(
                            'bg-primary text-white text-xs flex items-center justify-center absolute -mt-1 -ml-1',
                            qty <= 10
                              ? 'w-5 h-5 min-w-5 min-h-5 rounded-full'
                              : 'h-5 min-h-5 px-2 rounded-md',
                          )}
                        >
                          {qty}
                        </span>
                      ) : null;
                    })()}
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMG_URL}/${color?.Image}`}
                      alt={
                        color?.color?.colorName ??
                        color?.color?.name ??
                        'Color option'
                      }
                      width={56}
                      height={56}
                      className={cn(
                        'object-cover p-0.5 rounded-md',
                        selectedColor?.id === color?.color?.id &&
                          'border-2 border-primary',
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
            <ScrollArea className="max-h-96 min-w-0 max-w-full max-lg:w-full">
              <div className="mt-4 min-w-0 rounded-md border-2 border-[#EEEEEE] overflow-hidden">
                <div
                  className={cn(
                    'grid min-w-0 gap-1 p-1 py-2 sm:gap-3',
                    hasSpecification
                      ? 'grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]'
                      : 'grid-cols-3',
                  )}
                >
                  <div className="min-w-0 text-start">
                    <span className="block w-full rounded-md bg-[#F5F5F5] px-1.5 py-1.5 text-start font-medium text-sm leading-snug whitespace-normal sm:px-3 sm:py-2">
                      {hasSpecification ? 'Specification' : 'Size'}
                    </span>
                  </div>
                  <div className="min-w-0 text-center">
                    <span className="block w-full rounded-md bg-[#F5F5F5] px-1.5 py-1.5 text-center  font-medium sm:px-3 sm:py-2 text-sm">
                      Price
                    </span>
                  </div>
                  <div className="min-w-0 text-center">
                    <span className="block w-full rounded-md bg-[#F5F5F5] px-1.5 py-1.5 text-center  font-medium sm:px-3 sm:py-2 text-sm">
                      Quantity
                    </span>
                  </div>
                </div>

                {sizes?.map((size: any) => (
                  <SizeCard
                    key={size?.id}
                    colorId={effectiveColorId}
                    size={size?.size?.sizeName}
                    displayLabel={
                      hasSpecification ? String(specification) : undefined
                    }
                    specLayout={hasSpecification}
                    price={size?.SalePrice}
                    SalePrice={size?.SalePrice}
                    RegularPrice={size?.RegularPrice}
                    max={Number(
                      bulkQuantities
                        ? (size?.total_stock ?? size?.stock)
                        : size?.stock,
                    )}
                    bulkQuantities={bulkQuantities}
                    totalQuantity={bulkQuantities ? totalQuantity : undefined}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
