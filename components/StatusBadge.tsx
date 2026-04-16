import type { InvoiceStatus } from '@/lib/db';

interface StatusBadgeProps {
  status: InvoiceStatus;
}

const statusConfig: Record<InvoiceStatus, { label: string; bg: string; text: string; dot: string }> = {
  draft: {
    label: 'Draft',
    bg: 'rgba(100,116,141,0.10)',
    text: '#64748d',
    dot: '#64748d',
  },
  sent: {
    label: 'Sent',
    bg: 'rgba(83,58,253,0.10)',
    text: '#533afd',
    dot: '#533afd',
  },
  paid: {
    label: 'Paid',
    bg: 'rgba(21,190,83,0.10)',
    text: '#15be53',
    dot: '#15be53',
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = statusConfig[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 10px',
        borderRadius: '4px',
        background: cfg.bg,
        color: cfg.text,
        fontSize: '12px',
        fontWeight: 500,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: cfg.dot,
          flexShrink: 0,
        }}
      />
      {cfg.label}
    </span>
  );
}
