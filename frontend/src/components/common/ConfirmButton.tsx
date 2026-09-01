import React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

type Tone = 'default' | 'success' | 'danger';

interface ConfirmButtonProps {
  children: React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: Tone;
  buttonClassName?: string;
  onConfirm: () => void;
}

const TONE_CLASSES: Record<Tone, string> = {
  default: 'bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-[#1a1408]',
  success: 'bg-[var(--success)] hover:opacity-90 text-[#0a1a10]',
  danger: 'bg-[var(--danger)] hover:opacity-90 text-white',
};

export const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  children,
  title,
  description,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  tone = 'default',
  buttonClassName,
  onConfirm,
}) => (
  <AlertDialog.Root>
    <AlertDialog.Trigger asChild>
      <button type="button" className={buttonClassName}>
        {children}
      </button>
    </AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="fixed inset-0 bg-black/60 z-[60]" />
      <AlertDialog.Content className="fixed left-1/2 top-1/2 z-[60] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 bg-[var(--panel)] border border-[var(--line)] rounded-lg shadow-[var(--shadow-modal)] overflow-hidden focus:outline-none">
        <div className="px-5 py-3.5 border-b border-[var(--line)]">
          <AlertDialog.Title className="text-sm font-semibold text-[var(--t1)]">
            {title}
          </AlertDialog.Title>
        </div>
        <div className="p-5 space-y-4">
          <AlertDialog.Description className="text-sm text-[var(--t2)] leading-relaxed">
            {description}
          </AlertDialog.Description>
          <div className="flex items-center justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                className="px-3.5 py-2 rounded-md border border-[var(--line)] text-sm font-medium text-[var(--t2)] hover:bg-[var(--chip)] transition cursor-pointer"
              >
                {cancelLabel}
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                type="button"
                onClick={onConfirm}
                className={`px-3.5 py-2 rounded-md font-semibold text-sm transition-colors cursor-pointer ${TONE_CLASSES[tone]}`}
              >
                {confirmLabel}
              </button>
            </AlertDialog.Action>
          </div>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);

export default ConfirmButton;
