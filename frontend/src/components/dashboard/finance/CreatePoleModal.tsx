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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#111827] border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl text-white overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 bg-[#0B0F17]/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg border bg-amber-500/10 border-amber-500/30 text-amber-500">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Créer un Pôle</h2>
              <p className="text-xs text-gray-400 mt-0.5">Renseignez les informations du nouveau pôle</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 hover:bg-gray-800/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest block border-b border-gray-800/80 pb-1">
              Informations du Pôle
            </span>

            {/* Nom */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-300">
                Nom du pôle <span className="text-amber-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Building2 className="w-4 h-4 text-gray-500 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  maxLength={50}
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ex: Pôle IT, Formation, Tourisme..."
                  className="w-full h-10 bg-[#0B0F17] border border-gray-800 rounded-lg pl-9 pr-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-300">
                Description
              </label>
              <div className="relative flex items-start">
                <Type className="w-4 h-4 text-gray-500 absolute left-3 top-3 pointer-events-none" />
                <textarea
                  rows={3}
                  maxLength={255}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez l'activité du pôle (optionnel)"
                  className="w-full bg-[#0B0F17] border border-gray-800 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="px-4 py-2.5 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-800 mt-6">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500/80" />
              <span>Champs avec * obligatoires</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2 bg-gray-800/80 hover:bg-gray-800 text-gray-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg text-sm transition-colors shadow-lg shadow-amber-500/10 flex items-center gap-2 disabled:opacity-60 cursor-pointer"
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
