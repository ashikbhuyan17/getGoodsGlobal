import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { fetcher } from '@/lib/fetcher';
import { notFound } from 'next/navigation';
import PaymentPageClient from './_components/PaymentPageClient';

export const PAYMENT_CACHE = 60;

type PaymentItem = {
  amount?: number;
  advanced?: number;
  payable?: number;
  invoice_id?: string;
};

type PaymentResponse = {
  status?: string;
  data?: PaymentItem | PaymentItem[];
};

type BankItem = {
  id?: number;
  status?: string;
  account_name?: string;
  account_number?: string;
  branch?: string;
  routing_number?: string;
  image?: string;
  description?: string;
};

type BankListResponse = {
  status?: string;
  data?: BankItem[];
};

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;

  const [payment, bankList] = await Promise.all([
    fetcher<PaymentResponse>(`/payment/${invoiceId}`),
    fetcher<BankListResponse>(`/bank-lists`, {}, PAYMENT_CACHE).catch(() => ({
      data: [],
    })),
  ]);

  if (payment?.status === 'error' || !payment?.data) {
    notFound();
  }

  const rawData = payment.data;
  const firstPayment = Array.isArray(rawData) ? rawData[0] : rawData;
  if (!firstPayment) notFound();

  const orderLabel = invoiceId ? `SKY${invoiceId}` : '—';
  const total = Number(firstPayment?.amount) || 0;
  const paid = 0;
  const advance = Number(firstPayment?.advanced) || 0;
  const payable = Number(firstPayment?.payable) || 0;

  return (
    <div className="min-h-screen space-y-4 max-md:mb-20 mb-10">
      <div className="bg-white p-3 -mt-1 flex items-center">
        <h1 className="text-lg font-bold text-gray-900">Payment</h1>
      </div>
      <div className="px-2">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Section – Order Details (server, same page) */}
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
                    <tr className="hover:bg-gray-50 transition font-semibold">
                      <td className="py-3 px-4">
                        <Link
                          href={`/account/orders/${invoiceId}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          {orderLabel}
                        </Link>
                      </td>
                      <td className="py-3 px-4">৳{total}</td>
                      <td className="py-3 px-4">{advance}%</td>
                      <td className="py-3 px-4">৳{paid}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span>৳{payable}</span>
                          {/* <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium inline-block w-fit">
                            ৳{payable}
                          </div> */}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* Right Section – client (interactive) */}
          <PaymentPageClient
            initialPayable={payable}
            bankList={bankList}
            invoiceId={invoiceId}
          />
        </div>
      </div>
    </div>
  );
}
