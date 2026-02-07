"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Upload, X, MessageCircle, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Demo payment accounts data
const paymentAccounts = [
  {
    id: "bkash",
    name: "bKash",
    icon: "/bkash.svg",
    accountName: "SKY BUY BD",
    accountNumber: "01712345678",
    branch: "Mobile Banking",
    routingNo: "N/A",
  },
  {
    id: "citybank",
    name: "City Bank",
    icon: "/city_bank.png",
    accountName: "SKY BUY BD",
    accountNumber: "1503098139001",
    branch: "Dhanmondi",
    routingNo: "225261187",
  },
  {
    id: "bracbank",
    name: "BRAC Bank",
    icon: "/brac_bank.png",
    accountName: "SKY BUY BD",
    accountNumber: "2059604340001",
    branch: "MOTIJHEEL GRAPHICS BUILDING BRANCH",
    routingNo: "060272531",
  },
  {
    id: "dutchbangla",
    name: "Dutch-Bangla Bank",
    icon: "/dutch_bangla_bank.png",
    accountName: "SKY BUY BD",
    accountNumber: "1201234567890",
    branch: "Gulshan",
    routingNo: "090272531",
  },
  {
    id: "islamibank",
    name: "Islami Bank Bangladesh Limited",
    icon: "/islami_bank.png",
    accountName: "SKY BUY BD",
    accountNumber: "1301234567890",
    branch: "Uttara",
    routingNo: "100272531",
  },
  // {
  //   id: "points",
  //   name: "Point",
  //   icon: "/placeholder-product.png",
  //   accountName: "N/A",
  //   accountNumber: "0",
  //   branch: "N/A",
  //   routingNo: "N/A",
  // },
];

// Demo order data matching image
const demoOrder = {
  order: "SKY254565",
  total: 9414,
  advance: "50%",
  paid: 0,
  payable: 4707,
};

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;

  const [selectedPayment, setSelectedPayment] = useState<string>("citybank");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>("4707");

  const selectedAccount = paymentAccounts.find((acc) => acc.id === selectedPayment);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
  };

  return (
    <div className="min-h-screen space-y-4">
      <div className="bg-white p-3 mt-[-4px] flex items-center">
        <h1 className="text-lg font-bold text-gray-900">Payment</h1>
      </div>
      <div className="px-2">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Section - Order Details */}
          <div className="lg:col-span-3">
            <Card className="rounded shadow">
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Order</th>
                      <th className="py-3 px-4 font-semibold">Total</th>
                      <th className="py-3 px-4 font-semibold">Advance</th>
                      <th className="py-3 px-4 font-semibold">Paid</th>
                      <th className="py-3 px-4 font-semibold">Payable</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4">
                        <Link
                          href={`/account/orders/${demoOrder.order.replace("SKY", "")}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          {demoOrder.order}
                        </Link>
                      </td>
                      <td className="py-3 px-4">৳{demoOrder.total}</td>
                      <td className="py-3 px-4">{demoOrder.advance}</td>
                      <td className="py-3 px-4">৳{demoOrder.paid}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span>৳{demoOrder.payable}</span>
                          <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium inline-block w-fit">
                            ৳{demoOrder.payable}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Payment Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Methods */}
            <Card className="bg-white rounded-lg">
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
                  {paymentAccounts.map((account) => {
                    const isSelected = selectedPayment === account.id;
                    const isCityBank = account.id === "citybank";
                    return (
                      <button
                        key={account.id}
                        onClick={() => setSelectedPayment(account.id)}
                        className={`relative p-4 border-2 rounded-lg transition-all ${isSelected
                          ? "border-teal-600 bg-teal-50"
                          : "border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-green-500 rounded-full p-0.5">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                        {/* {!isSelected && isCityBank && (
                          <div className="absolute top-1 right-1 bg-gray-300 rounded-full p-0.5">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )} */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="relative w-24 h-12">
                            <Image
                              src={account.icon}
                              alt={account.name}
                              fill
                              className="object-contain rounded"
                            />
                          </div>
                          {account.id === "points" && (
                            <div className="flex flex-col items-center">
                              <span className="text-xs font-medium text-gray-900">{account.name}</span>
                              <span className="text-xs text-gray-500">0</span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {/* Bank Details */}
                {selectedAccount && selectedAccount.id !== "points" && (
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b">
                      <h3 className="text-base font-semibold text-gray-900">
                        Bank Details
                      </h3>
                    </div>

                    <div className="divide-y">
                      <div className="grid grid-cols-12 border-b">
                        <div className="col-span-4 md:col-span-3 bg-gray-50 px-4 py-2 text-sm text-gray-600 font-medium">
                          Account Name
                        </div>
                        <div className="col-span-8 md:col-span-9 px-4 py-2 text-sm text-gray-900">
                          {selectedAccount.accountName}
                        </div>
                      </div>
                      <div className="grid grid-cols-12 border-b">
                        <div className="col-span-4 md:col-span-3 bg-gray-50 px-4 py-2 text-sm text-gray-600 font-medium">
                          Account Number
                        </div>
                        <div className="col-span-8 md:col-span-9 px-4 py-2 text-sm text-gray-900">
                          {selectedAccount.accountNumber}
                        </div>
                      </div>
                      <div className="grid grid-cols-12 border-b">
                        <div className="col-span-4 md:col-span-3 bg-gray-50 px-4 py-2 text-sm text-gray-600 font-medium">
                          Branch
                        </div>
                        <div className="col-span-8 md:col-span-9 px-4 py-2 text-sm text-gray-900">
                          {selectedAccount.branch}
                        </div>
                      </div>
                      <div className="grid grid-cols-12 border-b last:border-b-0">
                        <div className="col-span-4 md:col-span-3 bg-gray-50 px-4 py-2 text-sm text-gray-600 font-medium">
                          Routing No
                        </div>
                        <div className="col-span-8 md:col-span-9 px-4 py-2 text-sm text-gray-900">
                          {selectedAccount.routingNo}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Upload Slip */}
                <div>
                  <Label className="text-sm font-medium mb-2 block text-gray-900">
                    Upload Slip / Screenshot
                  </Label>
                  {uploadedImage ? (
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="relative w-full h-48 mb-4">
                        <Image
                          src={uploadedImage}
                          alt="Payment slip"
                          fill
                          className="object-contain rounded"
                        />
                      </div>
                      <Button
                        onClick={handleRemoveImage}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-teal-600 transition-colors min-h-[150px]">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Plus className="h-12 w-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Upload Slip / Screenshot</span>
                    </label>
                  )}
                </div>
                {/* Payment Amount */}
                <div >
                  <div >
                    <Label htmlFor="paymentAmount" className="text-sm font-medium mb-2 block text-gray-900">
                      Payment Amount
                    </Label>
                    <Input
                      id="paymentAmount"
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                {/* Pay Button */}
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => router.push("/account/orders")}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-6 text-lg"
                  >
                    Pay ৳{paymentAmount}
                  </Button>
                  {/* <button className="bg-teal-600 hover:bg-teal-700 text-white rounded-full p-4 shadow-lg shrink-0">
                    <MessageCircle className="h-6 w-6" />
                  </button> */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
