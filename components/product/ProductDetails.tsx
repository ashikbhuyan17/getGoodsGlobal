/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { Eye } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import SizeCard from "./SizeCard";

export default function ProductDetails({
  product,
  selectedColor,
  setSelectedColor,
  setSelectedSizes,
  bulkQuantities,
  setPrice,
  shippingchargeId,
}: {
  product: any;
  setSelectedSizes: any;
  selectedColor: any;
  setSelectedColor: any;
  bulkQuantities?: any;
  setPrice: any;
  shippingchargeId: string;
}) {
  const [image, setImage] = useState(
    `${process.env.NEXT_PUBLIC_IMG_URL}/${product?.data?.product?.image?.image}`,
  );

  return (
    <div className="p-6 flex flex-col md:flex-row mt-4 gap-4 overflow-x-hidden justify-center border-border">
      {/* Left Section - Image Gallery */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex lg:flex-col gap-2">
          <div
            onClick={() =>
              setImage(
                `${process.env.NEXT_PUBLIC_IMG_URL}/${product?.data?.product?.image?.image}`,
              )
            }
            className="w-16 h-16 rounded-md overflow-hidden border cursor-pointer"
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_IMG_URL}/${product?.data?.product?.image?.image}`}
              alt={product?.data?.product?.name}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
          {JSON.parse(product?.data?.product?.PostImage)?.map((img: string) => (
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
                alt={product?.data?.product?.name}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>

        <div className="relative md:w-96 md:h-96 w-full h-full">
          <Dialog>
            <DialogTrigger asChild>
              <div className="absolute inset-0 flex items-center justify-center gap-1 text-sm bg-black/40 text-white cursor-pointer opacity-0 hover:opacity-100 transition-all duration-300 z-10">
                <Eye size={15} /> <span>Preview</span>
              </div>
            </DialogTrigger>

            <DialogContent className="aspect-square">
              <Image
                src={image}
                alt={product?.data?.product?.name}
                fill
                className="rounded-lg object-cover"
              />
            </DialogContent>
          </Dialog>
          <Image
            src={image}
            alt="main shoe"
            width={700}
            height={700}
            className="rounded-lg shadow-md object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Right Section - Offer and Details */}
      <div className="w-full max-w-sm">
        <Card className="border-none shadow-none p-0">
          <CardContent className="p-0 shadow-none px-2 border-0 space-y-6">
            {bulkQuantities && (
              <div className="bg-gray-50 rounded-md p-4">
                <div
                  className={cn(
                    "grid justify-center items-center",
                    bulkQuantities?.data?.length
                      ? `grid-cols-${
                          bulkQuantities?.data?.length < 3
                            ? bulkQuantities?.data?.length
                            : 3
                        }`
                      : "grid-cols-1",
                  )}
                >
                  {bulkQuantities &&
                    bulkQuantities?.data?.map(
                      (bulk: any, i: number) =>
                        i < 3 && (
                          <div className="w-full" key={bulk?.id}>
                            <p className="text-2xl font-semibold text-gray-800">
                              ৳{bulk?.price}
                            </p>
                            <p className="text-sm text-gray-500">
                              {bulk?.title}
                            </p>
                          </div>
                        ),
                    )}
                </div>
              </div>
            )}

            <div>
              <p className="font-medium text-gray-700 mb-2">
                Color :{" "}
                <span className="text-primary cursor-pointer">
                  {selectedColor?.colorName}
                </span>
              </p>
              <div className="flex relative flex-wrap gap-3">
                {product?.data?.productColors?.map((color: any) => (
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
                    {Number(color?.color_qty) > 0 && (
                      <span className="w-4 h-4 bg-primary text-white text-xs flex items-center justify-center rounded-full absolute -mt-1 -ml-1">
                        {color?.color_qty}
                      </span>
                    )}
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMG_URL}/${color?.Image}`}
                      alt="color1"
                      width={56}
                      height={56}
                      className={cn(
                        "object-cover p-0.5 rounded-md",
                        selectedColor?.id === color?.color?.id &&
                          "border-2 border-primary",
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
            <ScrollArea className="h-56">
              <div className="mt-4">
                <div className="grid grid-cols-3 gap-3 border-b pb-2 text-gray-600 font-medium">
                  <p>Size</p>
                  <p>Price</p>
                  <p>Quantity</p>
                </div>

                {product?.data?.productSizes?.map((size: any) => (
                  <SizeCard
                    shippingchargeId={shippingchargeId}
                    colorId={selectedColor?.id}
                    id={size?.id}
                    productId={product?.data?.product?.id}
                    setPrice={setPrice}
                    setSizes={setSelectedSizes}
                    key={size?.id}
                    size={size?.size?.sizeName}
                    price={size?.SalePrice}
                    max={Number(size?.stock)}
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
