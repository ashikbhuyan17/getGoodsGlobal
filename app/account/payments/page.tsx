import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import ImagePreview from '@/components/common/ImagePreview';
import { fetcher } from '@/lib/fetcher';
import { getOrderStatusStyle } from '@/lib/orderStatusStyle';
import { Database } from 'lucide-react';

function formatDateTime(dateString: string) {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateString;
  }
}

export default async function PaymentsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res: any = await fetcher('/payments');
  const payments = res?.data || [];

  return (
    <div className="w-full space-y-4 px-2 pb-20">
      <Card className="rounded shadow">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b">
              <tr>
                <th className="py-3 px-4 font-semibold">Payment ID</th>
                <th className="py-3 px-4 font-semibold">Invoice ID</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Method</th>
                <th className="py-3 px-4 font-semibold">Pay Slip</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg mb-2">
                        <Database className="w-6 h-6 mx-auto my-3 text-gray-400" />
                      </div>
                      No payments found
                    </div>
                  </td>
                </tr>
              ) : (
                payments.map((payment: Record<string, unknown>) => {
                  const order = payment?.order as
                    | { invoice_id?: string; paid_partial_payment_amount: string, pay_slip_image?: string | null, status: any }
                    | undefined;
                  const invoiceId = order?.invoice_id;
                  const paySlipImage = order?.pay_slip_image;
                  const paid_partial_payment_amount =
                    order?.paid_partial_payment_amount;
                  const status = order?.status?.name;

                  return (
                    <tr
                      key={String(payment?.id)}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4">
                        <span className="font-medium">
                          {String(payment?.payment_id || 'N/A')}
                        </span>
                        <span className="block text-xs font-medium mt-0.5 text-gray-500">
                          {formatDateTime(String(payment?.created_at || ''))}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {invoiceId ? (
                          <Link
                            href={`/account/orders/${invoiceId}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                          >
                            {invoiceId}
                          </Link>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        ৳{String(paid_partial_payment_amount ?? 'N/A')}
                      </td>

                      <td className="py-3 px-4">
                        <Badge className="bg-gray-900 text-white hover:bg-gray-800 px-3 py-1 rounded-md text-xs font-medium border-0">
                          {String(payment?.payment_method || 'N/A')}
                        </Badge>
                      </td>

                      <td className="py-3 px-4">
                        {paySlipImage ? (
                          <ImagePreview
                            src={paySlipImage}
                            alt={`Payment slip ORD-${invoiceId || 'N/A'}`}
                            width={48}
                            height={48}
                            className="shrink-0 rounded border border-gray-200"
                          />
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-sm font-medium ${getOrderStatusStyle(
                            String(status ?? ''),
                          )}`}
                        >
                          {status || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
