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
  cod?: string | null;
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
        <PaymentPageClient
          invoiceId={invoiceId}
          orderLabel={orderLabel}
          total={total}
          advance={advance}
          paid={paid}
          initialPayable={payable}
          bankList={bankList}
        />
      </div>
    </div>
  );
}
