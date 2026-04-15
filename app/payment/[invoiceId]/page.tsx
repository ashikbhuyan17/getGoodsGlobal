import { fetcher } from '@/lib/fetcher';
import { notFound } from 'next/navigation';
import PaymentPageClient from './_components/PaymentPageClient';

export const PAYMENT_CACHE = 60;

type PaymentItem = {
  amount?: number;
  invoice_id?: string;
};

type PaymentResponse = {
  status?: string;
  data?: PaymentItem | PaymentItem[];
  banks?: BankItem[];
  advanced?: number | string;
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

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;

  const payment = await fetcher<PaymentResponse>(`/payment/${invoiceId}`);

  if (payment?.status === 'error' || !payment?.data) {
    notFound();
  }

  const rawData = payment.data;
  const firstPayment = Array.isArray(rawData) ? rawData[0] : rawData;
  if (!firstPayment) notFound();

  const orderLabel = invoiceId ? `SKY${invoiceId}` : '—';
  const subTotal = Number(firstPayment?.amount) || 0;
  const banks = Array.isArray(payment?.banks) ? payment.banks : [];
  const advancedPercent = Number(payment?.advanced) || 0;

  return (
    <div className="min-h-screen space-y-4 max-md:mb-20 mb-10">
      <div className="bg-white p-3 -mt-1 flex items-center">
        <h1 className="text-lg font-bold text-gray-900">Payment</h1>
      </div>
      <div className="px-2">
        <PaymentPageClient
          invoiceId={invoiceId}
          orderLabel={orderLabel}
          subTotal={subTotal}
          banks={banks}
          advanced={advancedPercent}
        />
      </div>
    </div>
  );
}
