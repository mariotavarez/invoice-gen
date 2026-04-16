import type { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  accentColor?: string;
}

export default function StatsCard({ title, value, subtitle, icon, accentColor }: StatsCardProps) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5edf5',
        borderRadius: '6px',
        padding: '24px',
        boxShadow: 'rgba(50,50,93,0.07) 0px 2px 5px -1px, rgba(0,0,0,0.05) 0px 1px 3px -1px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: '#64748d',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {title}
        </span>
        {icon && (
          <span style={{ color: accentColor ?? '#533afd', opacity: 0.7 }}>{icon}</span>
        )}
      </div>
      <div
        style={{
          fontSize: '28px',
          fontWeight: 300,
          color: '#061b31',
          letterSpacing: '-0.5px',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: '13px', color: '#64748d' }}>{subtitle}</div>
      )}
    </div>
  );
}
