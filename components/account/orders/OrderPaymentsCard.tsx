import { Badge } from "@/components/ui/badge";

interface OrderPaymentsCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payment: any;
}

export default function OrderPaymentsCard({ payment }: OrderPaymentsCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateString;
    }
  };

  const Row = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="grid grid-cols-12 border-b last:border-b-0">
      <div className="col-span-4 md:col-span-3 bg-gray-50 px-4 py-3 text-sm text-gray-600 font-medium">
        {label}
      </div>
      <div className="col-span-8 md:col-span-9 px-4 py-3 text-sm text-gray-900">
        {value}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b">
        <h3 className="text-base font-semibold text-gray-900">
          Payments
        </h3>
      </div>

      <div className="divide-y">
        <Row
          label="Method"
          value={
            <Badge className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
              {payment?.payment_method || payment?.order_type || payment?.method || "N/A"}
            </Badge>
          }
        />
        <Row
          label="Date"
          value={formatDate(payment?.created_at || payment?.date || payment?.payment_date)}
        />
        <Row
          label="Amount"
          value={`৳${payment?.amount ?? payment?.paid_amount ?? payment?.advance ?? payment?.paid_partial_payment_amount ?? "N/A"}`}
        />
        {payment?.payment_due_amount != null && Number(payment.payment_due_amount) >= 0 && (
          <Row label="Due" value={`৳${payment.payment_due_amount}`} />
        )}
        {(payment?.bkash_tranxId || payment?.transaction_id || payment?.trx_id) && (
          <Row
            label="Trx ID"
            value={
              <span className="font-mono">
                {payment?.bkash_tranxId || payment?.transaction_id || payment?.trx_id}
              </span>
            }
          />
        )}
      </div>
    </div>
  );
}
