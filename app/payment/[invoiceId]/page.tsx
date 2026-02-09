/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { fetcher } from '@/lib/fetcher';
import { notFound } from 'next/navigation';
import PaymentPageClient from './_components/PaymentPageClient';

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;

  // Fetch payment data (array of payments)
  const payment: any = await fetcher(`/payment/${invoiceId}`);

  // Fetch bank list
  let bankList: any = null;
  try {
    bankList = await fetcher(`/bank-lists`);
    // Handle error response
    if (bankList?.status === 'error' || !bankList?.data) {
      bankList = { data: [] };
    }
  } catch {
    bankList = { data: [] };
  }

  // Handle error response
  if (
    payment?.status === 'error' ||
    !payment?.data ||
    !Array.isArray(payment.data) ||
    payment.data.length === 0
  ) {
    notFound();
  }

  // Get first payment to extract invoice_id
  const firstPayment = payment.data[0];
  // const invoiceId = firstPayment?.invoice_id ?? invoiceId;
  const orderLabel = invoiceId ? `SKY${invoiceId}` : '—';

  // Calculate total amount: first payment is 50% advance, so total = first payment * 2
  const total = firstPayment?.amount > 0 ? firstPayment?.amount : 0;

  const paid = 0;

  // Payable Amount = 50% of total (remaining 50% after advance)
  const payable = Math.round(total * 0.5);
  const initialPayable = payable;
  const advance = '50%';

  return (
    <div className="min-h-screen space-y-4">
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
                      <td className="py-3 px-4">{advance}</td>
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
            initialPayable={initialPayable}
            bankList={bankList}
            invoiceId={invoiceId}
          />
        </div>
      </div>
    </div>
  );
}
