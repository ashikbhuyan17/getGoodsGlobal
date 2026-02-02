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

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payments</h3>
      
      <div className="space-y-3">
        {/* Payment Method */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Method:</span>
          <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
            {payment?.payment_method || payment?.method || "N/A"}
          </Badge>
        </div>

        {/* Date */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Date:</span>
          <span className="text-sm font-medium text-gray-900">
            {formatDate(payment?.created_at || payment?.date || payment?.payment_date)}
          </span>
        </div>

        {/* Amount */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Amount:</span>
          <span className="text-sm font-medium text-gray-900">
            ৳{payment?.amount || payment?.paid_amount || "N/A"}
          </span>
        </div>

        {/* Transaction ID */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Trx ID:</span>
          <span className="text-sm font-medium text-gray-900 font-mono">
            {payment?.transaction_id || payment?.trx_id || payment?.trxid || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
