'use client';

import { useToast } from '@/context/ToastContext';
import { Check, X, AlertCircle, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

function ToastItem({ id, message, type, onDismiss }: {
  id: string; message: string; type: 'success' | 'error' | 'info'; onDismiss: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  // Fade in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const icon = type === 'success'
    ? <Check className="w-4 h-4" />
    : type === 'error'
    ? <AlertCircle className="w-4 h-4" />
    : <Info className="w-4 h-4" />;

  const accentColor = type === 'success' ? '#1FA7BB' : type === 'error' ? '#EF4444' : '#A8A9A2';

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 16px",
        borderRadius: 12,
        background: "#121315",
        border: `1px solid ${accentColor}30`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px ${accentColor}20`,
        minWidth: 220,
        maxWidth: 340,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
        cursor: "default",
      }}
    >
      <div style={{ color: accentColor, flexShrink: 0 }}>{icon}</div>
      <span style={{ color: "#F5F4F5", fontSize: 13, fontWeight: 500, flex: 1 }}>{message}</span>
      <button
        onClick={() => onDismiss(id)}
        style={{ color: "#A8A9A2", flexShrink: 0, lineHeight: 1, background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "flex-end",
        pointerEvents: "none",
      }}
    >
      {toasts.map(toast => (
        <div key={toast.id} style={{ pointerEvents: "auto" }}>
          <ToastItem
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={dismissToast}
          />
        </div>
      ))}
    </div>
  );
}
