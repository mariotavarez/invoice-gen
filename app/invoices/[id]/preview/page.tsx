import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Printer } from 'lucide-react';
import { getInvoiceById } from '@/lib/db';
import PrintableInvoice from '@/components/PrintableInvoice';

export const dynamic = 'force-dynamic';

interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { id } = await params;
  const invoice = getInvoiceById(id);

  if (!invoice) notFound();

  return (
    <>
      {/* Controls (hidden on print) */}
      <div
        className="no-print"
        style={{
          background: '#1c1e54',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          href={`/invoices/${id}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '13px',
            textDecoration: 'none',
          }}
        >
          <ChevronLeft size={14} /> Back to Invoice
        </Link>

        <button
          onClick={() => window.print()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            padding: '8px 18px',
            background: '#533afd',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          <Printer size={14} /> Print / Save PDF
        </button>
      </div>

      {/* Print-trigger script */}
      <div className="no-print" style={{ background: '#f4f7fb', padding: '24px 0' }}>
        <PrintableInvoice invoice={invoice} />
      </div>

      {/* Print-only version */}
      <div style={{ display: 'none' }} id="print-only">
        <PrintableInvoice invoice={invoice} />
      </div>

      {/* Inline script for print button */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.querySelectorAll('button').forEach(btn => {
              if (btn.textContent.includes('Print')) {
                btn.addEventListener('click', () => window.print());
              }
            });
          `,
        }}
      />
    </>
  );
}
