/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Plus, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { submitPayment } from '@/lib/fetcher';
import { formatPriceInt } from '@/lib/utils';

export default function PaymentPageClient({
  invoiceId,
  orderLabel,
  subTotal,
  banks,
  advanced = 0,
}: {
  invoiceId: string;
  orderLabel: string;
  /** Sub-Total = item price + shipping fee (from API amount). */
  subTotal: number;
  /** Banks list from payment API response. */
  banks?: any[];
  /** Advance percentage from payment API (used only for COD). */
  advanced?: number;
}) {
  // Transform API bank list data to component format (include cod for COD method)
  const paymentAccounts =
    Array.isArray(banks) && banks.length > 0
      ? banks
          .filter((bank: any) => bank.status === '1')
          .map((bank: any) => ({
            id: String(bank.id),
            name: bank.account_name,
            icon: bank.image
              ? `${process.env.NEXT_PUBLIC_IMG_URL}/${bank.image}`
              : '/bank-placeholder.png',
            accountName: bank.account_name,
            accountNumber: bank.account_number,
            branch: bank.branch || 'N/A',
            routingNo: bank.routing_number || 'N/A',
            description: bank.description || '',
            cod: bank.cod != null && bank.cod !== '' ? String(bank.cod) : null,
          }))
      : [];

  const [selectedPayment, setSelectedPayment] = useState<string>(
    paymentAccounts.length > 0 ? String(paymentAccounts[0].id) : '',
  );
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedAccount = paymentAccounts.find(
    (acc: any) => acc.id === selectedPayment,
  );

  // Cash Payment Fee/Charge = percentage fee (from bank cod %)
  const codPercent =
    selectedAccount?.cod != null && selectedAccount?.cod !== ''
      ? Number(selectedAccount.cod) || 0
      : 0;
  const cashPaymentFeeNum = subTotal * (codPercent / 100);
  const totalAmount = subTotal + cashPaymentFeeNum;
  const isCodSelected = selectedAccount?.accountName
    ?.toLowerCase()
    .includes('cash on delivery');
  // Advance percentage (from payment API). Used only when COD method is selected.
  const advancePercent = isCodSelected ? Math.max(0, Number(advanced) || 0) : 0;
  // BKash/Bank: Payable = Total. COD: Payable = Total * advance%.
  const payableAmount = isCodSelected
    ? totalAmount * (advancePercent / 100)
    : totalAmount;
  // Helper: rounded integer as number
  const roundInt = (n: number) => Number(formatPriceInt(n));
  // Display values (keep arithmetic consistent: Due = TotalDisplay - PayableDisplay)
  const subTotalDisplay = roundInt(subTotal);
  const cashFeeDisplay = roundInt(cashPaymentFeeNum);
  const totalDisplay = roundInt(totalAmount);
  const payableDisplayNum = roundInt(payableAmount);
  const payableDisplay = String(payableDisplayNum);
  const dueDisplay = isCodSelected
    ? String(totalDisplay - payableDisplayNum)
    : '0';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!selectedAccount) {
      toast.error('Please select a payment method');
      return;
    }

    if (!uploadedFile) {
      toast.error('Please upload payment slip');
      return;
    }

    setIsSubmitting(true);
    toast.loading('Submitting payment...');

    try {
      const formData = new FormData();
      formData.append('pay_slip_image', uploadedFile);
      formData.append('payment_method', selectedAccount.accountName);
      formData.append('payment_method_id', selectedAccount.id);
      formData.append('invoice_id', invoiceId);

      const data = await submitPayment(invoiceId, formData);
      toast.dismiss();

      if (data?.status === true || data?.status === 'success') {
        toast.success(data?.message || 'Payment submitted successfully!');
        // Use setTimeout to ensure toast shows before redirect
        setTimeout(() => {
          window.location.href = '/account/orders';
        }, 1000);
      } else {
        toast.error(data?.message || 'Failed to submit payment');
      }
    } catch {
      toast.dismiss();
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Left – Order summary: Order > Sub-Total > Cash Payment Fee > Total > Payable > Due (only for COD). Advance removed. */}
      <div className="lg:col-span-3">
        <Card className="rounded shadow">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b">
                <tr>
                  <th className="py-3 px-4 font-semibold">Order</th>
                  <th className="py-3 px-4 font-semibold">Sub-Total</th>
                  <th className="py-3 px-4 font-semibold">Cash Fee</th>
                  <th className="py-3 px-4 font-semibold">Total</th>
                  {isCodSelected && (
                    <th className="py-3 px-4 font-semibold">Advance</th>
                  )}
                  <th className="py-3 px-4 font-semibold">Payable</th>
                  {isCodSelected && (
                    <th className="py-3 px-4 font-semibold min-w-30">Due</th>
                  )}
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50 transition font-semibold">
                  <td className="py-3 px-4">
                    <Link
                      href={`/account/orders/${invoiceId}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                    >
                      {orderLabel}
                    </Link>
                  </td>
                  <td className="py-3 px-4">৳{subTotalDisplay}</td>
                  <td className="py-3 px-4">৳{cashFeeDisplay}</td>
                  <td className="py-3 px-4">৳{totalDisplay}</td>
                  {isCodSelected && (
                    <td className="py-3 px-4">{advancePercent}%</td>
                  )}
                  <td className="py-3 px-4">৳{payableDisplay}</td>
                  {isCodSelected && (
                    <td className="py-3 px-4">৳{dueDisplay}</td>
                  )}
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Right – Payment method and form */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-white rounded-lg">
          <CardContent className="space-y-3">
            {paymentAccounts.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
                {paymentAccounts.map((account: any) => {
                  const isSelected = selectedPayment === account.id;
                  return (
                    <button
                      key={account.id}
                      type="button"
                      onClick={() => setSelectedPayment(account.id)}
                      aria-label={`Select ${account.name} payment method`}
                      className={`relative p-4 border-2 rounded-lg transition-all ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-green-500 rounded-full p-0.5">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative w-full lg:w-14 xl:w-full h-12">
                          <Image
                            src={account.icon}
                            alt={account.name}
                            fill
                            className="object-contain rounded"
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No payment methods available
              </div>
            )}
            {selectedAccount && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b">
                  <h3 className="text-base font-semibold text-gray-900">
                    {selectedAccount.accountName} Details
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
                  {selectedAccount.accountName != 'BKash' && (
                    <>
                      <div className="grid grid-cols-12 border-b">
                        <div className="col-span-4 md:col-span-3 bg-gray-50 px-4 py-2 text-sm text-gray-600 font-medium">
                          Branch
                        </div>
                        <div className="col-span-8 md:col-span-9 px-4 py-2 text-sm text-gray-900">
                          {selectedAccount.branch}
                        </div>
                      </div>
                      <div className="grid grid-cols-12 border-b">
                        <div className="col-span-4 md:col-span-3 bg-gray-50 px-4 py-2 text-sm text-gray-600 font-medium">
                          Routing No
                        </div>
                        <div className="col-span-8 md:col-span-9 px-4 py-2 text-sm text-gray-900">
                          {selectedAccount.routingNo}
                        </div>
                      </div>
                    </>
                  )}
                  {selectedAccount.description && (
                    <div className="border-b last:border-b-0">
                      <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600 font-medium border-b">
                        Payment Guidelines
                      </div>
                      <div
                        className="px-4 py-3 text-sm text-gray-900 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_li]:my-1 [&_ul]:space-y-1"
                        dangerouslySetInnerHTML={{
                          __html: selectedAccount.description,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
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
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setUploadedImage(null);
                      setUploadedFile(null);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove Image
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-teal-600 transition-colors min-h-37.5">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Plus className="h-12 w-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Upload Slip / Screenshot
                  </span>
                </label>
              )}
            </div>
            <div>
              <Label
                htmlFor="paymentAmount"
                className="text-sm font-medium mb-2 block text-gray-900"
              >
                Payable Amount
              </Label>
              <Input
                id="paymentAmount"
                type="text"
                value={payableDisplay}
                readOnly
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                onClick={handlePaymentSubmit}
                disabled={isSubmitting || !uploadedFile || !selectedAccount}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  `Pay ৳${payableDisplay}`
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
