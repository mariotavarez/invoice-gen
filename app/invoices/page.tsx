import Link from 'next/link';
import { Plus } from 'lucide-react';
import InvoiceTable from '@/components/InvoiceTable';
import { getInvoices } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function InvoicesPage() {
  const invoices = getInvoices();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '32px',
        }}
      >
        <div>
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
            Invoices
          </h1>
          <p style={{ margin: '8px 0 0', fontSize: '15px', color: '#64748d' }}>
            {invoices.length === 0
              ? 'No invoices yet. Create your first one.'
              : `${invoices.length} invoice${invoices.length !== 1 ? 's' : ''} total`}
          </p>
        </div>

        <Link
          href="/invoices/new"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            padding: '10px 20px',
            background: '#533afd',
            color: '#fff',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          <Plus size={16} />
          New Invoice
        </Link>
      </div>

      <InvoiceTable invoices={invoices} />
    </div>
  );
}
