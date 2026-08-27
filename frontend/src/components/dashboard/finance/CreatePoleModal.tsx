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

  const [prevOpen, setPrevOpen] = useState(isOpen);
  if (isOpen !== prevOpen) {
    setPrevOpen(isOpen);
    if (isOpen) {
      setNom('');
      setDescription('');
    }
  }

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ nom: nom.trim(), description: description.trim() || undefined });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[var(--panel)] border border-[var(--border-subtle)] rounded-2xl w-full max-w-lg shadow-2xl text-[var(--t1)] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-subtle)] bg-[var(--panel-deep)]/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg border bg-[var(--honey)]/10 border-[var(--honey)]/30 text-[var(--honey)]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--t1)]">Créer un Pôle</h2>
              <p className="text-xs text-[var(--t3)] mt-0.5">Renseignez les informations du nouveau pôle</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--t3)] hover:text-[var(--t1)] p-2 hover:bg-[var(--chip)] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <span className="text-[11px] font-bold text-[var(--honey)] uppercase tracking-widest block border-b border-[var(--border-subtle)] pb-1">
              Informations du Pôle
            </span>

            {/* Nom */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[var(--t2)]">
                Nom du pôle <span className="text-[var(--honey)]">*</span>
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
                  className="field w-full h-10 pl-9 pr-3 text-sm"
                />
              </div>
            </div>

            {/* Description */}
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
                  className="field w-full pl-9 pr-3 py-2.5 text-sm resize-none"
                />
              </div>
            </div>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="px-4 py-2.5 rounded-lg bg-[var(--danger)]/10 border border-[var(--danger)]/40 text-[var(--danger)] text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)] mt-6">
            <div className="flex items-center gap-1.5 text-xs text-[var(--t3)]">
              <AlertCircle className="w-3.5 h-3.5 text-[var(--honey)]/80" />
              <span>Champs avec * obligatoires</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2 bg-[var(--chip)] hover:bg-[var(--border-subtle)] text-[var(--t2)] rounded-lg text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 btn-honey font-semibold rounded-lg text-sm flex items-center gap-2 disabled:opacity-60 cursor-pointer"
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