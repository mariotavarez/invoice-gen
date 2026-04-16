'use client';

import { useState, useTransition } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import LineItemRow, { type LineItemData } from './LineItemRow';
import { formatCurrency } from '@/lib/utils';
import { createInvoiceAction, updateInvoiceAction } from '@/lib/actions';
import type { Invoice } from '@/lib/db';

interface InvoiceFormProps {
  invoice?: Invoice;
  mode: 'create' | 'edit';
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  color: '#273951',
  marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #e5edf5',
  borderRadius: '4px',
  padding: '9px 12px',
  fontSize: '14px',
  color: '#273951',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

function focusInput(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  (e.target as HTMLElement).style.borderColor = '#533afd';
  (e.target as HTMLElement).style.boxShadow = '0 0 0 3px rgba(83,58,253,0.10)';
}
function blurInput(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  (e.target as HTMLElement).style.borderColor = '#e5edf5';
  (e.target as HTMLElement).style.boxShadow = 'none';
}

const defaultItem: LineItemData = { description: '', quantity: 1, unit_price: 0 };

export default function InvoiceForm({ invoice, mode }: InvoiceFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [lineItems, setLineItems] = useState<LineItemData[]>(
    invoice?.line_items && invoice.line_items.length > 0
      ? invoice.line_items.map((li) => ({
          description: li.description,
          quantity: li.quantity,
          unit_price: li.unit_price,
        }))
      : [{ ...defaultItem }]
  );

  const total = lineItems.reduce((sum, li) => sum + (li.quantity || 0) * (li.unit_price || 0), 0);

  function addItem() {
    setLineItems((prev) => [...prev, { ...defaultItem }]);
  }

  function updateItem(index: number, field: keyof LineItemData, value: string | number) {
    setLineItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function removeItem(index: number) {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formEl = e.currentTarget;
    const fd = new FormData(formEl);

    // Clear hidden li_ fields and re-add from state
    const existing = Array.from(fd.keys()).filter((k) => k.startsWith('li_'));
    existing.forEach((k) => fd.delete(k));
    lineItems.forEach((item) => {
      fd.append('li_description', item.description);
      fd.append('li_quantity', String(item.quantity));
      fd.append('li_unit_price', String(item.unit_price));
    });

    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createInvoiceAction(fd);
        } else if (invoice) {
          await updateInvoiceAction(invoice.id, fd);
        }
      } catch (err: unknown) {
        if (err instanceof Error && !err.message.includes('NEXT_REDIRECT')) {
          setError(err.message);
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div
          style={{
            background: '#fff5f5',
            border: '1px solid #fed7d7',
            borderRadius: '4px',
            padding: '12px 16px',
            color: '#c53030',
            fontSize: '14px',
            marginBottom: '20px',
          }}
        >
          {error}
        </div>
      )}

      {/* Client Information */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #e5edf5',
          borderRadius: '6px',
          padding: '24px',
          marginBottom: '16px',
        }}
      >
        <h2
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#061b31',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid #f0f4f8',
          }}
        >
          Client Information
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>
              Client Name <span style={{ color: '#e53e3e' }}>*</span>
            </label>
            <input
              style={inputStyle}
              name="client_name"
              required
              placeholder="John Smith"
              defaultValue={invoice?.client_name}
              onFocus={focusInput}
              onBlur={blurInput}
            />
          </div>
          <div>
            <label style={labelStyle}>
              Email Address <span style={{ color: '#e53e3e' }}>*</span>
            </label>
            <input
              style={inputStyle}
              name="client_email"
              type="email"
              required
              placeholder="john@example.com"
              defaultValue={invoice?.client_email}
              onFocus={focusInput}
              onBlur={blurInput}
            />
          </div>
          <div>
            <label style={labelStyle}>Company</label>
            <input
              style={inputStyle}
              name="client_company"
              placeholder="Acme Corp"
              defaultValue={invoice?.client_company}
              onFocus={focusInput}
              onBlur={blurInput}
            />
          </div>
          <div>
            <label style={labelStyle}>
              Due Date <span style={{ color: '#e53e3e' }}>*</span>
            </label>
            <input
              style={inputStyle}
              name="due_date"
              type="date"
              required
              defaultValue={invoice?.due_date ?? new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)}
              onFocus={focusInput}
              onBlur={blurInput}
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Billing Address</label>
            <input
              style={inputStyle}
              name="client_address"
              placeholder="123 Main St, City, State 10001"
              defaultValue={invoice?.client_address}
              onFocus={focusInput}
              onBlur={blurInput}
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #e5edf5',
          borderRadius: '6px',
          padding: '24px',
          marginBottom: '16px',
        }}
      >
        <h2
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#061b31',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid #f0f4f8',
          }}
        >
          Line Items
        </h2>

        {/* Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 100px 130px 110px 36px',
            gap: '8px',
            marginBottom: '8px',
          }}
        >
          {['Description', 'Qty', 'Unit Price', 'Subtotal', ''].map((h) => (
            <div
              key={h}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#64748d',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                textAlign: h === '' || h === 'Subtotal' || h === 'Unit Price' || h === 'Qty' ? 'right' : 'left',
              }}
            >
              {h}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {lineItems.map((item, idx) => (
            <LineItemRow
              key={idx}
              item={item}
              index={idx}
              onUpdate={updateItem}
              onRemove={removeItem}
              canRemove={lineItems.length > 1}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '16px',
            padding: '7px 14px',
            border: '1px dashed #b9b9f9',
            borderRadius: '4px',
            background: 'transparent',
            color: '#533afd',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(83,58,253,0.04)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
        >
          <Plus size={14} /> Add line item
        </button>

        {/* Total */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #e5edf5',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '14px', color: '#64748d', fontWeight: 500 }}>Total</span>
          <span style={{ fontSize: '24px', fontWeight: 300, color: '#061b31', letterSpacing: '-0.5px' }}>
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Notes */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #e5edf5',
          borderRadius: '6px',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <label style={{ ...labelStyle, marginBottom: '8px', display: 'block' }}>Notes</label>
        <textarea
          name="notes"
          rows={3}
          placeholder="Payment terms, bank details, or any additional information..."
          defaultValue={invoice?.notes}
          style={{
            ...inputStyle,
            resize: 'vertical',
            fontFamily: 'inherit',
            lineHeight: '1.5',
          }}
          onFocus={focusInput as unknown as React.FocusEventHandler<HTMLTextAreaElement>}
          onBlur={blurInput as unknown as React.FocusEventHandler<HTMLTextAreaElement>}
        />
      </div>

      {/* Submit */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          type="submit"
          disabled={isPending}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 24px',
            background: isPending ? '#7b65fd' : '#533afd',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: isPending ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => {
            if (!isPending) (e.currentTarget as HTMLButtonElement).style.background = '#4434d4';
          }}
          onMouseLeave={(e) => {
            if (!isPending) (e.currentTarget as HTMLButtonElement).style.background = '#533afd';
          }}
        >
          {isPending && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
          {mode === 'create' ? 'Create Invoice' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
