'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpDown, ArrowUp, ArrowDown, Eye, Edit } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { InvoiceWithTotal } from '@/lib/db';

type SortField = 'invoice_number' | 'client_name' | 'due_date' | 'total' | 'status' | 'created_at';
type SortDir = 'asc' | 'desc';

interface InvoiceTableProps {
  invoices: InvoiceWithTotal[];
}

export default function InvoiceTable({ invoices }: InvoiceTableProps) {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }

  const sorted = [...invoices].sort((a, b) => {
    let av: string | number = a[sortField] ?? '';
    let bv: string | number = b[sortField] ?? '';
    if (sortField === 'total') {
      av = a.total ?? 0;
      bv = b.total ?? 0;
    }
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  function SortIcon({ field }: { field: SortField }) {
    if (field !== sortField) return <ArrowUpDown size={13} style={{ opacity: 0.35 }} />;
    return sortDir === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />;
  }

  const thStyle: React.CSSProperties = {
    padding: '10px 16px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: 600,
    color: '#64748d',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    borderBottom: '1px solid #e5edf5',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',
  };

  const tdStyle: React.CSSProperties = {
    padding: '14px 16px',
    borderBottom: '1px solid #f0f4f8',
    fontSize: '14px',
    color: '#273951',
    verticalAlign: 'middle',
  };

  if (invoices.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '64px 24px',
          color: '#64748d',
          background: '#fff',
          border: '1px solid #e5edf5',
          borderRadius: '6px',
        }}
      >
        <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }}>📄</div>
        <div style={{ fontSize: '16px', fontWeight: 400, marginBottom: '6px', color: '#273951' }}>
          No invoices yet
        </div>
        <div style={{ fontSize: '14px' }}>Create your first invoice to get started.</div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5edf5',
        borderRadius: '6px',
        overflow: 'hidden',
        boxShadow: 'rgba(50,50,93,0.07) 0px 2px 5px -1px, rgba(0,0,0,0.05) 0px 1px 3px -1px',
      }}
    >
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {(
                [
                  ['invoice_number', 'Invoice #'],
                  ['client_name', 'Client'],
                  ['due_date', 'Due Date'],
                  ['total', 'Amount'],
                  ['status', 'Status'],
                ] as [SortField, string][]
              ).map(([field, label]) => (
                <th key={field} style={thStyle} onClick={() => handleSort(field)}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    {label} <SortIcon field={field} />
                  </span>
                </th>
              ))}
              <th style={{ ...thStyle, cursor: 'default' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((inv) => (
              <tr
                key={inv.id}
                style={{ transition: 'background 0.12s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '#f8fafc')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '')}
              >
                <td style={tdStyle}>
                  <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#533afd', fontWeight: 500 }}>
                    {inv.invoice_number}
                  </span>
                </td>
                <td style={tdStyle}>
                  <div style={{ fontWeight: 500, color: '#061b31', fontSize: '14px' }}>{inv.client_name}</div>
                  {inv.client_company && (
                    <div style={{ fontSize: '12px', color: '#64748d' }}>{inv.client_company}</div>
                  )}
                </td>
                <td style={tdStyle}>
                  <span style={{ color: '#64748d', fontSize: '13px' }}>{formatDate(inv.due_date)}</span>
                </td>
                <td style={tdStyle}>
                  <span style={{ fontWeight: 500, color: '#061b31' }}>{formatCurrency(inv.total)}</span>
                </td>
                <td style={tdStyle}>
                  <StatusBadge status={inv.status} />
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link
                      href={`/invoices/${inv.id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        background: 'transparent',
                        color: '#533afd',
                        border: '1px solid #b9b9f9',
                        fontSize: '12px',
                        fontWeight: 500,
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Eye size={12} /> View
                    </Link>
                    <Link
                      href={`/invoices/${inv.id}?edit=true`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        background: 'transparent',
                        color: '#64748d',
                        border: '1px solid #e5edf5',
                        fontSize: '12px',
                        fontWeight: 500,
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Edit size={12} /> Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
