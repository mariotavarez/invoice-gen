import type { Invoice } from '@/lib/db';
import { formatCurrency, formatDate } from '@/lib/utils';

interface PrintableInvoiceProps {
  invoice: Invoice;
}

export default function PrintableInvoice({ invoice }: PrintableInvoiceProps) {
  const total = invoice.line_items?.reduce((s, li) => s + li.quantity * li.unit_price, 0) ?? 0;

  return (
    <div
      id="printable"
      style={{
        maxWidth: '780px',
        margin: '0 auto',
        background: '#fff',
        padding: '56px 64px',
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '56px' }}>
        {/* Brand */}
        <div>
          <div
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#533afd',
              letterSpacing: '-0.5px',
              marginBottom: '4px',
            }}
          >
            InvoiceGen
          </div>
          <div style={{ fontSize: '13px', color: '#64748d' }}>Professional Invoice</div>
        </div>

        {/* Invoice Meta */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '28px', fontWeight: 300, color: '#061b31', letterSpacing: '-0.5px' }}>
            {invoice.invoice_number}
          </div>
          <div
            style={{
              display: 'inline-block',
              marginTop: '6px',
              padding: '3px 10px',
              background:
                invoice.status === 'paid'
                  ? 'rgba(21,190,83,0.10)'
                  : invoice.status === 'sent'
                  ? 'rgba(83,58,253,0.10)'
                  : 'rgba(100,116,141,0.10)',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 500,
              color:
                invoice.status === 'paid'
                  ? '#15be53'
                  : invoice.status === 'sent'
                  ? '#533afd'
                  : '#64748d',
              textTransform: 'capitalize',
            }}
          >
            {invoice.status}
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748d', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
            Bill To
          </div>
          <div style={{ fontSize: '16px', fontWeight: 500, color: '#061b31', marginBottom: '4px' }}>
            {invoice.client_name}
          </div>
          {invoice.client_company && (
            <div style={{ fontSize: '14px', color: '#64748d', marginBottom: '4px' }}>{invoice.client_company}</div>
          )}
          <div style={{ fontSize: '14px', color: '#64748d' }}>{invoice.client_email}</div>
          {invoice.client_address && (
            <div style={{ fontSize: '14px', color: '#64748d', marginTop: '4px', whiteSpace: 'pre-line' }}>
              {invoice.client_address}
            </div>
          )}
        </div>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748d', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
            Invoice Details
          </div>
          {[
            ['Issue Date', formatDate(invoice.created_at)],
            ['Due Date', formatDate(invoice.due_date)],
            ['Invoice #', invoice.invoice_number],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', color: '#64748d' }}>{label}</span>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#273951' }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid #e5edf5', marginBottom: '0' }} />

      {/* Line Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '0' }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {[['Description', 'left'], ['Qty', 'right'], ['Unit Price', 'right'], ['Amount', 'right']].map(([h, align]) => (
              <th
                key={h}
                style={{
                  padding: '10px 14px',
                  textAlign: align as 'left' | 'right',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#64748d',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  borderBottom: '1px solid #e5edf5',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoice.line_items?.map((item, idx) => (
            <tr key={idx}>
              <td style={{ padding: '13px 14px', borderBottom: '1px solid #f0f4f8', fontSize: '14px', color: '#273951' }}>
                {item.description}
              </td>
              <td style={{ padding: '13px 14px', textAlign: 'right', borderBottom: '1px solid #f0f4f8', fontSize: '14px', color: '#64748d' }}>
                {item.quantity}
              </td>
              <td style={{ padding: '13px 14px', textAlign: 'right', borderBottom: '1px solid #f0f4f8', fontSize: '14px', color: '#64748d' }}>
                {formatCurrency(item.unit_price)}
              </td>
              <td style={{ padding: '13px 14px', textAlign: 'right', borderBottom: '1px solid #f0f4f8', fontSize: '14px', fontWeight: 500, color: '#273951' }}>
                {formatCurrency(item.quantity * item.unit_price)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total */}
      <div
        style={{
          borderTop: '2px solid #e5edf5',
          padding: '20px 14px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <span style={{ fontSize: '14px', color: '#64748d', fontWeight: 500 }}>Total Due</span>
        <span style={{ fontSize: '32px', fontWeight: 300, color: '#061b31', letterSpacing: '-0.8px' }}>
          {formatCurrency(total)}
        </span>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div
          style={{
            marginTop: '40px',
            padding: '20px 24px',
            background: '#f8fafc',
            borderRadius: '6px',
            border: '1px solid #e5edf5',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748d', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
            Notes
          </div>
          <div style={{ fontSize: '14px', color: '#273951', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {invoice.notes}
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: '56px',
          paddingTop: '24px',
          borderTop: '1px solid #e5edf5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '12px', color: '#b0bec5' }}>Generated by InvoiceGen</span>
        <span style={{ fontSize: '12px', color: '#b0bec5' }}>{invoice.invoice_number}</span>
      </div>
    </div>
  );
}
