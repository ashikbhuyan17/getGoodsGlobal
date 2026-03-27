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
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '../ui/dialog';
import SizeCard from './SizeCard';
import FlashSaleBanner from './FlashSaleBanner';
import { useProductStore } from '@/stores/useProductStore';
import { getActiveBulkTier, formatPriceInt } from '@/lib/utils';

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
      <div className='flex gap-2 w-full flex-col xl:flex-row'>
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
        <div className="w-full order-1 lg:order-2">
          <div className="relative h-[250px] xl:h-[220px]  2xl:h-[400px] w-full ">
            <Dialog>
              <DialogTrigger asChild>
                <div className="absolute inset-0 flex items-center justify-center gap-1 text-sm bg-black/40 text-white cursor-pointer opacity-0 hover:opacity-100 transition-all duration-300 z-10">
                  <Eye size={15} /> <span>Preview</span>
                </div>
              </DialogTrigger>

              <DialogContent className="aspect-square  max-2xl:w-[400px]">
                <DialogTitle className="sr-only">
                  Image preview: {p?.name}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Preview of product image
                </DialogDescription>
                <Image
                  src={image}
                  alt={p?.name}
                  fill
                  className="rounded-lg object-cover"
                />
              </DialogContent>
            </Dialog>
            <Image
              src={image}
              alt={p?.name ?? 'Product'}
              width={250}
              height={250}
              className="rounded-lg shadow-md object-fill  sm:object-contain lg:object-cover w-full h-full p-1"
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
                    const activeTier = getActiveBulkTier(bulkQuantities, totalQuantity);
                    const isActive =
                      activeTier && Number(activeTier.min_qty) === Number(bulk?.min_qty ?? 0);
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
                    return (
                      <div
                        key={bulk?.id}
                        className={cn(
                          'relative px-4 py-6 transition-colors',
                          isActive ? style.bg : 'bg-gray-100',
                        )}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="flex flex-col items-center gap-1 space-y-2">
                            <p className="text-xl font-semibold text-gray-800">
                              ৳{formatPriceInt(bulk?.price ?? 0)}
                            </p>
                            {bulk?.old_price && (
                              <p className="text-sm text-gray-400 line-through">
                                ৳{formatPriceInt(bulk.old_price)}
                              </p>
                            )}
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
            <ScrollArea className="h-56 max-lg:w-full max-2xl:w-[320px]">
              <div className="mt-4 border-2 border-[#EEEEEE] rounded-md overflow-hidden">
                <div className="grid grid-cols-3 gap-3 p-1 py-2 border-gray-200">
                  <div className="text-start">
                    <span className="block w-full bg-[#F5F5F5]  font-medium px-3 py-2 rounded-md text-sm text-start">
                      {hasSpecification ? 'Specification' : 'Size'}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="block w-full bg-[#F5F5F5]  font-medium px-3 py-2 rounded-md text-sm text-center">
                      Price
                    </span>
                  </div>
                  <div className="text-center ">
                    <span className="block w-full bg-[#F5F5F5]  font-medium px-3 py-2 rounded-md text-sm text-center">
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
                    price={size?.SalePrice}
                    max={Number(size?.stock)}
                    flashSalePercentage={flashSale?.flash_sale_percentage}
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
