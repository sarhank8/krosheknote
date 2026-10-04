import React from 'react';
import { Sparkles, CheckCircle2, Info } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Toast = () => {
  const { toast } = useShop();

  if (!toast) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 2000,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid var(--border-pink)',
      boxShadow: '0 12px 32px rgba(232, 122, 147, 0.25)',
      borderRadius: 'var(--radius-md)',
      padding: '14px 22px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: 'var(--primary-deep)',
      fontWeight: '600',
      fontSize: '0.92rem',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      {toast.type === 'success' ? (
        <Sparkles size={20} color="var(--primary)" className="animate-pulse-heart" />
      ) : (
        <Info size={20} color="var(--primary-dark)" />
      )}
      <span>{toast.message}</span>
    </div>
  );
};
