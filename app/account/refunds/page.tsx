import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { fetcher } from '@/lib/fetcher';
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

export default async function RefundsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res: any = await fetcher('/refunds');
  const refunds = res?.data || [];

  return (
    <div className="w-full space-y-4 px-2 pb-20">
      <Card className="rounded shadow">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b">
              <tr>
                <th className="py-3 px-4 font-semibold">Order</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Paid</th>
                {/* <th className="py-3 px-4 font-semibold">Due</th> */}
                <th className="py-3 px-4 font-semibold">Admin Note</th>
              </tr>
            </thead>

            <tbody>
              {refunds.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg mb-2">
                        <Database className="w-6 h-6 mx-auto my-3 text-gray-400" />
                      </div>
                      No refunds found
                    </div>
                  </td>
                </tr>
              ) : (
                refunds.map((refund: Record<string, unknown>) => {
                  const invoiceId = refund?.invoice_id;

                  return (
                    <tr
                      key={String(refund?.id)}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4">
                        {invoiceId ? (
                          <Link
                            href={`/account/orders/${invoiceId}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                          >
                            ORD-{String(invoiceId)}
                          </Link>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {formatDateTime(String(refund?.created_at || ''))}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        ৳{String(refund?.amount ?? 'N/A')}
                      </td>
                      <td className="py-3 px-4">
                        ৳{String(refund?.paid_partial_payment_amount ?? 'N/A')}
                      </td>
                      {/* <td className="py-3 px-4">
                        ৳{String(refund?.payment_due_amount ?? 'N/A')}
                      </td> */}
                      <td className="py-3 px-4 text-gray-500">
                        {refund?.admin_note ? (
                          <span className="text-gray-700">
                            {String(refund.admin_note)}
                          </span>
                        ) : (
                          '—'
                        )}
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
