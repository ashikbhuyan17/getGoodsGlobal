import { Badge } from '@/components/ui/badge';

interface OrderDetailsCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export default function OrderDetailsCard({ data }: OrderDetailsCardProps) {
  const getStatusBadgeColor = (status: string | number) => {
    const statusStr = String(status || '').toLowerCase();

    if (statusStr === '1' || statusStr.includes('pending')) {
      return 'bg-gray-500 text-white';
    }
    if (statusStr.includes('shipped')) {
      return 'bg-gray-900 text-white';
    }
    if (statusStr.includes('completed')) {
      return 'bg-green-600 text-white';
    }
    return 'bg-gray-500 text-white';
  };

  const getStatusLabel = (status: string | number) => {
    const statusStr = String(status || '').trim();
    if (!statusStr) return 'N/A';
    if (statusStr === '1') return 'Pending';
    if (statusStr === '2') return 'Processing';
    if (statusStr === '3') return 'Completed';
    return statusStr;
  };

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
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
        <h3 className="text-base font-semibold text-gray-900">Order Details</h3>
      </div>

      <div className="divide-y">
        <Row
          label="Status"
          value={
            <Badge
              className={`text-xs px-3 py-1 rounded-full ${getStatusBadgeColor(
                data?.order_status,
              )}`}
            >
              {getStatusLabel(data?.order_status)}
            </Badge>
          }
        />

        <Row label="Name" value={data?.name || 'N/A'} />
        <Row label="Phone" value={data?.phone || 'N/A'} />
        <Row label="Email" value={data?.email || 'N/A'} />

        <Row
          label="Delivery Address"
          value={
            <span className="leading-relaxed">
              {data?.address || 'N/A'}
              {data?.district && `, ${data.district}`}
              {data?.city && `, ${data.city}`}
              {data?.country && `, ${data.country}`}
            </span>
          }
        />

        {/* <Row
          label="Delivery Method"
          value={
            <Badge className="bg-gray-900 text-white text-xs px-3 py-1 rounded-full">
              {data?.delivery_method || data?.order_type || 'N/A'}
            </Badge>
          }
        /> */}

        <Row
          label="Shipping Method"
          value={
            <Badge className="bg-gray-900 text-white text-xs px-3 py-1 rounded-full">
              {data?.shipping_method || data?.order_type || 'N/A'}
            </Badge>
          }
        />

        <Row
          label="Advance Payment"
          value={
            data?.advance_payment ??
            data?.advance ??
            data?.paid_partial_payment_amount ??
            'N/A'
          }
        />

        <Row
          label="Shipping Charge"
          value={
            data?.shipping_charge != null ? `৳${data.shipping_charge}` : 'N/A'
          }
        />

        {/* <Row label="Total Weight" value={data?.total_weight || '-'} />
        <Row label="Delivered Weight" value={data?.delivered_weight || '-'} /> */}
      </div>
    </div>
  );
}
