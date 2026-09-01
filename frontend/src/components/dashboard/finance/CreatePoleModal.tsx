import React, { useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-lg w-full max-w-lg shadow-[var(--shadow-modal)] overflow-hidden my-8">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--line)]">
          <div>
            <h2 className="text-sm font-semibold text-[var(--t1)]">Créer un pôle</h2>
            <p className="text-xs text-[var(--t3)] mt-0.5">Renseignez les informations du nouveau pôle</p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--t3)] hover:text-[var(--t1)] p-1 hover:bg-[var(--surface-hover)] rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="space-y-4">
            <span className="text-[11px] font-semibold text-[var(--t3)] uppercase tracking-wider block border-b border-[var(--line)] pb-1">
              Informations du pôle
            </span>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--t2)]">
                Nom du pôle <span className="text-[var(--accent)]">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={50}
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex: Pôle IT, Formation, Tourisme..."
                className="w-full bg-[var(--panel-deep)] border border-[var(--line)] rounded-md px-3 py-2 text-sm text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-muted)] focus:border-transparent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--t2)]">
                Description
              </label>
              <textarea
                rows={3}
                maxLength={255}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez l'activité du pôle (optionnel)"
                className="w-full bg-[var(--panel-deep)] border border-[var(--line)] rounded-md px-3 py-2 text-sm text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-muted)] focus:border-transparent resize-none"
              />
            </div>
          </div>

          {error && (
            <div className="px-3 py-2 rounded-md bg-[var(--danger-bg)] border border-[var(--danger-line)] text-[var(--danger)] text-xs flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-[var(--line)]">
            <span className="text-xs text-[var(--t3)]">Champs avec * obligatoires</span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-3.5 py-2 bg-[var(--panel-deep)] border border-[var(--line)] hover:bg-[var(--chip)] text-[var(--t2)] rounded-md text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-[#1a1408] font-semibold rounded-md text-sm transition-colors flex items-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  'Créer le pôle'
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
