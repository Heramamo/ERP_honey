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
  default: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
  success: 'bg-emerald-600 hover:bg-emerald-500 text-white',
  danger: 'bg-rose-600 hover:bg-rose-500 text-white',
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
      <AlertDialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]" />
      <AlertDialog.Content className="fixed left-1/2 top-1/2 z-[60] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 bg-[var(--panel)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden focus:outline-none">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--panel-deep)]">
          <AlertDialog.Title className="text-sm font-bold text-[var(--t1)] uppercase tracking-wider">
            {title}
          </AlertDialog.Title>
        </div>
        <div className="p-6 space-y-5">
          <AlertDialog.Description className="text-sm text-[var(--t2)] leading-relaxed">
            {description}
          </AlertDialog.Description>
          <div className="flex items-center justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                className="px-4 py-2.5 rounded-lg border border-[var(--border-subtle)] text-sm font-semibold text-[var(--t2)] hover:bg-[var(--chip)] transition cursor-pointer"
              >
                {cancelLabel}
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                type="button"
                onClick={onConfirm}
                className={`px-4 py-2.5 rounded-lg font-bold text-sm transition-colors cursor-pointer ${TONE_CLASSES[tone]}`}
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
