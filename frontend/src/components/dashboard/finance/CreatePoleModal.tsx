import React, { useState } from 'react';
import { X, Building2, Loader2, Check, AlertCircle, Type } from 'lucide-react';
import type { CreatePoleDto } from '../../../service/finance.service';

interface CreatePoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreatePoleDto) => Promise<void>;
  submitting?: boolean;
  error?: string | null;
}

export const CreatePoleModal: React.FC<CreatePoleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  submitting = false,
  error,
}) => {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');

  const reset = () => {
    setNom('');
    setDescription('');
  };

  React.useEffect(() => {
    if (isOpen) reset();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ nom: nom.trim(), description: description.trim() || undefined });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl w-full max-w-lg shadow-[var(--shadow-modal)] overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--line)] bg-[var(--panel-deep)]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg border bg-[var(--accent-soft)] border-[var(--accent)]/25 text-[var(--accent)]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--t1)]">Créer un Pôle</h2>
              <p className="text-xs text-[var(--t3)] mt-0.5">Renseignez les informations du nouveau pôle</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--t3)] hover:text-[var(--t1)] p-2 hover:bg-[var(--surface-hover)] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <span className="text-[11px] font-bold text-[var(--accent)] block border-b border-[var(--line)] pb-1">
              Informations du Pôle
            </span>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[var(--t2)]">
                Nom du pôle <span className="text-[var(--accent)]">*</span>
              </label>
              <div className="relative flex items-center">
                <Building2 className="w-4 h-4 text-[var(--t3)] absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  maxLength={50}
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ex: Pôle IT, Formation, Tourisme..."
                  className="w-full h-10 bg-[var(--panel-deep)] border border-[var(--line)] rounded-lg pl-9 pr-3 text-sm text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/25 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[var(--t2)]">
                Description
              </label>
              <div className="relative flex items-start">
                <Type className="w-4 h-4 text-[var(--t3)] absolute left-3 top-3 pointer-events-none" />
                <textarea
                  rows={3}
                  maxLength={255}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez l'activité du pôle (optionnel)"
                  className="w-full bg-[var(--panel-deep)] border border-[var(--line)] rounded-lg pl-9 pr-3 py-2.5 text-sm text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/25 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="px-4 py-2.5 rounded-lg bg-[var(--danger-bg)] border border-[var(--danger-line)] text-[var(--danger)] text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-[var(--line)] mt-6">
            <div className="flex items-center gap-1.5 text-xs text-[var(--t3)]">
              <AlertCircle className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Champs avec * obligatoires</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2 bg-[var(--surface-hover)] hover:bg-[var(--chip)] text-[var(--t2)] rounded-lg text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-slate-950 font-semibold rounded-lg text-sm transition-colors flex items-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Créer le Pôle
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePoleModal;
