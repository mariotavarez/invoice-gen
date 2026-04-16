import Link from 'next/link';
import { Plus, TrendingUp, DollarSign, Clock, FileText } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import InvoiceTable from '@/components/InvoiceTable';
import { getDashboardStats, getInvoices } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const stats = getDashboardStats();
  const invoices = getInvoices().slice(0, 10);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Page Header */}
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
            Dashboard
          </h1>
          <p style={{ margin: '8px 0 0', fontSize: '15px', color: '#64748d' }}>
            Overview of your invoicing activity
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

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '40px',
        }}
      >
        <StatsCard
          title="Total Invoiced"
          value={formatCurrency(stats.total_invoiced)}
          subtitle={`${stats.invoice_count} invoice${stats.invoice_count !== 1 ? 's' : ''} total`}
          icon={<TrendingUp size={18} />}
        />
        <StatsCard
          title="Paid"
          value={formatCurrency(stats.total_paid)}
          subtitle={`${stats.paid_count} invoice${stats.paid_count !== 1 ? 's' : ''} paid`}
          icon={<DollarSign size={18} />}
          accentColor="#15be53"
        />
        <StatsCard
          title="Outstanding"
          value={formatCurrency(stats.total_outstanding)}
          subtitle={`${stats.invoice_count - stats.paid_count} unpaid`}
          icon={<Clock size={18} />}
          accentColor="#e97316"
        />
        <StatsCard
          title="Drafts"
          value={String(stats.draft_count)}
          subtitle="Not yet sent"
          icon={<FileText size={18} />}
          accentColor="#64748d"
        />
      </div>

      {/* Recent Invoices */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 300,
              color: '#061b31',
              letterSpacing: '-0.3px',
              margin: 0,
            }}
          >
            Recent Invoices
          </h2>
          <Link
            href="/invoices"
            style={{
              fontSize: '13px',
              color: '#533afd',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            View all →
          </Link>
        </div>

        <InvoiceTable invoices={invoices} />
      </div>
    </div>
  );
}
