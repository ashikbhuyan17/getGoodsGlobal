import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { fetcher } from "@/lib/fetcher";
import { notFound } from "next/navigation";

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const order: any = await fetcher(`/order-track/${id}`);
  if (order?.data?.length < 1) notFound();
  const data = order?.data?.[0];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Order Summary */}
      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Invoice ID:</span>
            <span>#{data?.invoice_id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Order Type:</span>
            <span>{data?.order_type}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Status:</span>
            <Badge className="text-xs">
              {data?.order_status === "1" ? "Pending" : data?.order_status}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Total Amount:</span>
            <span>{data?.amount} ৳</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Shipping Charge:</span>
            <span>{data?.shipping_charge} ৳</span>
          </div>
        </CardContent>
      </Card>

      {/* Product List */}
      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {data?.order_details?.map((item: any) => (
            <div key={item.id} className="border p-4 rounded-xl space-y-2">
              <div className="flex justify-between">
                <p className="font-semibold">{item?.product_name}</p>
                <p className="text-sm">{item?.sale_price} ৳</p>
              </div>
              <Separator />
              <div className="text-sm flex justify-between">
                <span>Size:</span>
                <span>{item?.product_size}</span>
              </div>
              <div className="text-sm flex justify-between">
                <span>Quantity:</span>
                <span>{item?.qty}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
