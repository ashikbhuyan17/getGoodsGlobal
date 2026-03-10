import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import DeliveryTopBar from '@/components/account/delivery/DeliveryTopBar';
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

function buildDeliverySlug(status?: string, keyword?: string): string {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (keyword?.trim()) params.set('keyword', keyword.trim());
  const qs = params.toString();
  return `/delivery${qs ? `?${qs}` : ''}`;
}

export default async function DeliveryPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; keyword?: string }>;
}) {
  const params = await searchParams;
  const slug = buildDeliverySlug(params.status, params.keyword);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res: any = await fetcher(slug, { cache: 'no-store' });
  const deliveries = res?.data || [];

  return (
    <div className="w-full space-y-4 pb-20">
      <DeliveryTopBar />

      <div className="px-2">
        <Card className="rounded shadow">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b">
                <tr>
                  <th className="py-3 px-4 font-semibold">Invoice ID</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Method</th>
                  <th className="py-3 px-4 font-semibold">Amount</th>
                  <th className="py-3 px-4 font-semibold">Paid</th>
                  <th className="py-3 px-4 font-semibold">Due</th>
                  <th className="py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {deliveries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg mb-2" >
                          <Database className="w-6 h-6 mx-auto my-3 text-gray-400" />
                        </div>
                        No deliveries found
                      </div>
                    </td>
                  </tr>
                ) : (
                  deliveries.map((d: Record<string, unknown>) => {
                    const invoiceId = d?.invoice_id;
                    const amount = Number(d?.amount ?? 0);
                    const paidAmount = Number(
                      d?.paid_partial_payment_amount ?? 0,
                    );
                    const due = Number(d?.payment_due_amount ?? 0);
                    const shipping = d?.shipping as
                      | { area?: string }
                      | undefined;
                    const method = shipping?.area ?? 'N/A';

                    return (
                      <tr
                        key={String(d?.id)}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="py-3 px-4">
                          {invoiceId ? (
                            <Link
                              href={`/account/orders/${invoiceId}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                            >
                              {String(invoiceId)}
                            </Link>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {formatDateTime(String(d?.created_at ?? ''))}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className="bg-green-600 text-white hover:bg-green-700 px-3 py-1 rounded-md text-xs font-medium border-0">
                            {method}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">৳{amount}</td>
                        <td className="py-3 px-4">৳{paidAmount}</td>
                        <td className="py-3 px-4">৳{due}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {paidAmount < amount && (
                              <Link href={`/payment/${invoiceId}`}>
                                <Button
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700 text-white rounded px-3 py-1 text-xs"
                                >
                                  Pay
                                </Button>
                              </Link>
                            )}
                            <Link href={`/account/orders/${invoiceId}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded px-3 py-1 text-xs"
                              >
                                Invoice
                              </Button>
                            </Link>
                          </div>
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
    </div>
  );
}
