/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Plus, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { submitPayment } from '@/lib/fetcher';

export default function PaymentPageClient({
  initialPayable,
  bankList,
  invoiceId,
}: {
  initialPayable: number;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  bankList?: any;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  invoiceId: string;
}) {
  const router = useRouter();

  // Transform API bank list data to component format
  const paymentAccounts =
    bankList?.data && Array.isArray(bankList.data) && bankList.data.length > 0
      ? bankList.data
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
        }))
      : [];

  const [selectedPayment, setSelectedPayment] = useState<string>(
    paymentAccounts.length > 0 ? String(paymentAccounts[0].id) : '',
  );
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>(
    String(initialPayable),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedAccount = paymentAccounts.find(
    (acc: any) => acc.id === selectedPayment,
  );

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
    } catch (error) {
      console.log('🚀 ~ handlePaymentSubmit ~ error:', error);
      toast.dismiss();
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
                    className={`relative p-4 border-2 rounded-lg transition-all ${isSelected
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
                    <div className="grid grid-cols-12 border-b last:border-b-0">
                      <div className="col-span-4 md:col-span-3 bg-gray-50 px-4 py-2 text-sm text-gray-600 font-medium">
                        Routing No
                      </div>
                      <div className="col-span-8 md:col-span-9 px-4 py-2 text-sm text-gray-900">
                        {selectedAccount.routingNo}
                      </div>
                    </div>
                  </>
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
              type="number"
              value={paymentAmount}
              disabled
              onChange={(e) => setPaymentAmount(e.target.value)}
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
                `Pay ৳${paymentAmount}`
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
