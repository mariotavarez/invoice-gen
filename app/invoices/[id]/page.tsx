import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Eye, Trash2, CheckCircle, Send, RotateCcw } from 'lucide-react';
import { getInvoiceById } from '@/lib/db';
import { formatCurrency, formatDate } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import InvoiceForm from '@/components/InvoiceForm';
import {
  markAsPaidAction,
  markAsSentAction,
  markAsDraftAction,
  deleteInvoiceAction,
} from '@/lib/actions';

export const dynamic = 'force-dynamic';

interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}

export default async function InvoiceDetailPage({ params, searchParams }: InvoiceDetailPageProps) {
  const { id } = await params;
  const { edit } = await searchParams;
  const invoice = getInvoiceById(id);

  if (!invoice) notFound();

  const isEditing = edit === 'true';
  const total = invoice.line_items?.reduce((s, li) => s + li.quantity * li.unit_price, 0) ?? 0;

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

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 300,
                color: '#061b31',
                letterSpacing: '-0.5px',
                margin: 0,
              }}
            >
              {invoice.invoice_number}
            </h1>
            <StatusBadge status={invoice.status} />
          </div>
          <p style={{ margin: 0, fontSize: '15px', color: '#64748d' }}>
            {invoice.client_name}
            {invoice.client_company ? ` · ${invoice.client_company}` : ''} ·{' '}
            {formatCurrency(total)} due {formatDate(invoice.due_date)}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Link
            href={`/invoices/${id}/preview`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              border: '1px solid #b9b9f9',
              borderRadius: '4px',
              background: 'transparent',
              color: '#533afd',
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <Eye size={14} /> Preview / Print
          </Link>

          {invoice.status !== 'paid' && (
            <form action={markAsPaidAction.bind(null, id)}>
              <button
                type="submit"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  background: '#15be53',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <CheckCircle size={14} /> Mark Paid
              </button>
            </form>
          )}

          {invoice.status === 'draft' && (
            <form action={markAsSentAction.bind(null, id)}>
              <button
                type="submit"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  border: '1px solid #e5edf5',
                  borderRadius: '4px',
                  background: '#fff',
                  color: '#273951',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <Send size={14} /> Mark Sent
              </button>
            </form>
          )}

          {invoice.status === 'paid' && (
            <form action={markAsDraftAction.bind(null, id)}>
              <button
                type="submit"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  border: '1px solid #e5edf5',
                  borderRadius: '4px',
                  background: '#fff',
                  color: '#64748d',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <RotateCcw size={14} /> Revert to Draft
              </button>
            </form>
          )}

          <form action={deleteInvoiceAction.bind(null, id)}>
            <button
              type="submit"
              onClick={(e) => {
                if (!confirm('Delete this invoice? This cannot be undone.')) e.preventDefault();
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                border: '1px solid #fed7d7',
                borderRadius: '4px',
                background: '#fff',
                color: '#e53e3e',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <Trash2 size={14} /> Delete
            </button>
          </form>
        </div>
      </div>

      {isEditing ? (
        <InvoiceForm invoice={invoice} mode="edit" />
      ) : (
        /* Invoice Detail View */
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '16px',
            }}
          >
            {/* Client Info */}
            <div
              style={{
                background: '#fff',
                border: '1px solid #e5edf5',
                borderRadius: '6px',
                padding: '24px',
              }}
            >
              <h3
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#64748d',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  margin: '0 0 16px',
                }}
              >
                Client
              </h3>
              <div style={{ fontSize: '16px', fontWeight: 500, color: '#061b31', marginBottom: '4px' }}>
                {invoice.client_name}
              </div>
              {invoice.client_company && (
                <div style={{ fontSize: '14px', color: '#64748d', marginBottom: '4px' }}>
                  {invoice.client_company}
                </div>
              )}
              <div style={{ fontSize: '14px', color: '#64748d' }}>{invoice.client_email}</div>
              {invoice.client_address && (
                <div style={{ fontSize: '14px', color: '#64748d', marginTop: '8px' }}>
                  {invoice.client_address}
                </div>
              )}
            </div>

            {/* Invoice Details */}
            <div
              style={{
                background: '#fff',
                border: '1px solid #e5edf5',
                borderRadius: '6px',
                padding: '24px',
              }}
            >
              <h3
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#64748d',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  margin: '0 0 16px',
                }}
              >
                Details
              </h3>
              {[
                ['Created', formatDate(invoice.created_at)],
                ['Due Date', formatDate(invoice.due_date)],
                ['Status', invoice.status],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    fontSize: '14px',
                  }}
                >
                  <span style={{ color: '#64748d' }}>{label}</span>
                  <span style={{ color: '#273951', fontWeight: 500, textTransform: 'capitalize' }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Line Items */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #e5edf5',
              borderRadius: '6px',
              overflow: 'hidden',
              marginBottom: '16px',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {[['Description', 'left'], ['Qty', 'right'], ['Unit Price', 'right'], ['Amount', 'right']].map(
                    ([h, align]) => (
                      <th
                        key={h}
                        style={{
                          padding: '10px 16px',
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
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {invoice.line_items?.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '13px 16px', borderBottom: '1px solid #f0f4f8', fontSize: '14px', color: '#273951' }}>
                      {item.description}
                    </td>
                    <td style={{ padding: '13px 16px', textAlign: 'right', borderBottom: '1px solid #f0f4f8', fontSize: '14px', color: '#64748d' }}>
                      {item.quantity}
                    </td>
                    <td style={{ padding: '13px 16px', textAlign: 'right', borderBottom: '1px solid #f0f4f8', fontSize: '14px', color: '#64748d' }}>
                      {formatCurrency(item.unit_price)}
                    </td>
                    <td style={{ padding: '13px 16px', textAlign: 'right', borderBottom: '1px solid #f0f4f8', fontSize: '14px', fontWeight: 500, color: '#273951' }}>
                      {formatCurrency(item.quantity * item.unit_price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              style={{
                padding: '16px 16px',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '20px',
                borderTop: '2px solid #e5edf5',
              }}
            >
              <span style={{ fontSize: '14px', color: '#64748d', fontWeight: 500 }}>Total</span>
              <span style={{ fontSize: '28px', fontWeight: 300, color: '#061b31', letterSpacing: '-0.5px' }}>
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div
              style={{
                background: '#fff',
                border: '1px solid #e5edf5',
                borderRadius: '6px',
                padding: '24px',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#64748d',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  margin: '0 0 12px',
                }}
              >
                Notes
              </h3>
              <p style={{ fontSize: '14px', color: '#273951', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                {invoice.notes}
              </p>
            </div>
          )}

          {/* Edit button */}
          <div style={{ textAlign: 'right', marginTop: '8px' }}>
            <Link
              href={`/invoices/${id}?edit=true`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                border: '1px solid #b9b9f9',
                borderRadius: '4px',
                color: '#533afd',
                fontSize: '13px',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Edit Invoice
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
