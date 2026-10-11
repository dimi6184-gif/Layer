"use client";

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function Toggle({ enabled, onChange, label, description, disabled = false }: ToggleProps) {
  return (
    <div className="flex items-start gap-4">
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && <h3 className="text-base font-bold text-white mb-1">{label}</h3>}
          {description && <p className="text-sm text-zinc-400">{description}</p>}
        </div>
      )}
      
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={disabled}
        onClick={() => !disabled && onChange(!enabled)}
        className={`
          relative inline-flex h-8 w-16 sm:h-7 sm:w-14
          flex-shrink-0 cursor-pointer rounded-full
          border-2 border-transparent
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black
          disabled:cursor-not-allowed disabled:opacity-50
          ${enabled ? 'bg-indigo-500' : 'bg-zinc-700'}
        `}
      >
        <span className="sr-only">{label || 'Toggle'}</span>
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block h-7 w-7 sm:h-6 sm:w-6
            transform rounded-full bg-white shadow ring-0
            transition duration-200 ease-in-out
            ${enabled ? 'translate-x-8 sm:translate-x-7' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
}

// Compact version without label (for inline use)
export function ToggleSwitch({ enabled, onChange, disabled = false }: Omit<ToggleProps, 'label' | 'description'>) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => !disabled && onChange(!enabled)}
      className={`
        relative inline-flex h-8 w-16 sm:h-7 sm:w-14
        flex-shrink-0 cursor-pointer rounded-full
        border-2 border-transparent
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black
        disabled:cursor-not-allowed disabled:opacity-50
        ${enabled ? 'bg-indigo-500' : 'bg-zinc-700'}
      `}
    >
      <span className="sr-only">Toggle</span>
      <span
        aria-hidden="true"
        className={`
          pointer-events-none inline-block h-7 w-7 sm:h-6 sm:w-6
          transform rounded-full bg-white shadow ring-0
          transition duration-200 ease-in-out
          ${enabled ? 'translate-x-8 sm:translate-x-7' : 'translate-x-0'}
        `}
      />
    </button>
  );
}
