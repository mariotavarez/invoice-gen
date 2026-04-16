import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import InvoiceForm from '@/components/InvoiceForm';

export default function NewInvoicePage() {
  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Breadcrumb */}
      <Link
        href="/invoices"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '13px',
          color: '#64748d',
          textDecoration: 'none',
          marginBottom: '24px',
        }}
      >
        <ChevronLeft size={14} /> Invoices
      </Link>

      <div style={{ marginBottom: '28px' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 300,
            color: '#061b31',
            letterSpacing: '-0.64px',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          New Invoice
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: '15px', color: '#64748d' }}>
          Fill in the details below to create a new invoice.
        </p>
      </div>

      <InvoiceForm mode="create" />
    </div>
  );
}
