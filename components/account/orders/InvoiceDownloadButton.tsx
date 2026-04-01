'use client';

import { Button } from '@/components/ui/button';

function normalizeInvoiceId(invoiceId: string | number) {
  const raw = String(invoiceId ?? '').trim();
  if (!raw) return '';
  return raw.toUpperCase().startsWith('ORD-') ? raw : `ORD-${raw}`;
}

export default function InvoiceDownloadButton({
  invoiceId,
}: {
  invoiceId: string | number;
}) {
  const openInvoice = () => {
    const normalizedInvoiceId = normalizeInvoiceId(invoiceId);
    if (!normalizedInvoiceId) return;
    window.open(
      `/api/order-print/${encodeURIComponent(normalizedInvoiceId)}?preview=1`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <Button
      size="sm"
      variant="outline"
      className="rounded"
      type="button"
      onClick={openInvoice}
    >
      Invoice
    </Button>
  );
}
