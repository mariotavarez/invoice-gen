'use client';

import { Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export interface LineItemData {
  description: string;
  quantity: number;
  unit_price: number;
}

interface LineItemRowProps {
  item: LineItemData;
  index: number;
  onUpdate: (index: number, field: keyof LineItemData, value: string | number) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #e5edf5',
  borderRadius: '4px',
  padding: '8px 10px',
  fontSize: '14px',
  color: '#273951',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

export default function LineItemRow({ item, index, onUpdate, onRemove, canRemove }: LineItemRowProps) {
  const subtotal = (item.quantity || 0) * (item.unit_price || 0);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 100px 130px 110px 36px',
        gap: '8px',
        alignItems: 'center',
      }}
    >
      {/* Hidden inputs for form submission */}
      <input type="hidden" name="li_description" value={item.description} />
      <input type="hidden" name="li_quantity" value={item.quantity} />
      <input type="hidden" name="li_unit_price" value={item.unit_price} />

      {/* Description */}
      <input
        style={inputStyle}
        placeholder="Description of service or product"
        value={item.description}
        onChange={(e) => onUpdate(index, 'description', e.target.value)}
        onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = '#533afd')}
        onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = '#e5edf5')}
      />

      {/* Quantity */}
      <input
        style={{ ...inputStyle, textAlign: 'right' }}
        type="number"
        min="0"
        step="0.01"
        placeholder="1"
        value={item.quantity === 0 ? '' : item.quantity}
        onChange={(e) => onUpdate(index, 'quantity', parseFloat(e.target.value) || 0)}
        onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = '#533afd')}
        onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = '#e5edf5')}
      />

      {/* Unit Price */}
      <input
        style={{ ...inputStyle, textAlign: 'right' }}
        type="number"
        min="0"
        step="0.01"
        placeholder="0.00"
        value={item.unit_price === 0 ? '' : item.unit_price}
        onChange={(e) => onUpdate(index, 'unit_price', parseFloat(e.target.value) || 0)}
        onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = '#533afd')}
        onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = '#e5edf5')}
      />

      {/* Subtotal */}
      <div
        style={{
          textAlign: 'right',
          fontSize: '14px',
          fontWeight: 500,
          color: subtotal > 0 ? '#061b31' : '#b0bec5',
          paddingRight: '4px',
          whiteSpace: 'nowrap',
        }}
      >
        {formatCurrency(subtotal)}
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        disabled={!canRemove}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          border: 'none',
          borderRadius: '4px',
          background: canRemove ? 'transparent' : 'transparent',
          color: canRemove ? '#64748d' : '#cdd5df',
          cursor: canRemove ? 'pointer' : 'not-allowed',
          transition: 'color 0.15s, background 0.15s',
        }}
        onMouseEnter={(e) => {
          if (canRemove) {
            (e.currentTarget as HTMLButtonElement).style.color = '#e53e3e';
            (e.currentTarget as HTMLButtonElement).style.background = '#fff5f5';
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = canRemove ? '#64748d' : '#cdd5df';
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
        }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
