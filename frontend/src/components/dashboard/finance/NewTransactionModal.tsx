import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Tag,
  Building2,
  FileText,
  Check,
  AlertCircle,
  Hash,
  Loader2,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchPoles } from '../../../store/slices/poleSlice';
import { createRevenu } from '../../../store/slices/revenuSlice';
import { createCharge } from '../../../store/slices/chargeSlice';
import { getApiErrorMessage } from '../../../service/error';

export type TransactionType = 'DEPENSE' | 'RECETTE';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
  onCreated?: () => void;
}

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'DEPENSE',
  onCreated,
}) => {
  const dispatch = useAppDispatch();
  const poles = useAppSelector((state) => state.poles.poles);

  const isDepense = defaultType === 'DEPENSE';

  const [formData, setFormData] = useState({
    libelle: '',
    montant: '',
    pole: '',
    nature: 'FIXE',
    dateOperation: new Date().toISOString().split('T')[0],
    typeRevenu: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (poles.length === 0) {
      dispatch(fetchPoles());
    }
  }, [dispatch, poles.length]);

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        libelle: '',
        montant: '',
        typeRevenu: '',
        nature: 'FIXE',
        dateOperation: new Date().toISOString().split('T')[0],
        pole: poles[0] ? String(poles[0].id) : '',
      }));
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, defaultType, poles]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const montant = Number(formData.montant);
    const idPole = Number(formData.pole);
    if (!formData.pole || isNaN(idPole)) {
      setError('Veuillez sélectionner un pôle.');
      setSubmitting(false);
      return;
    }

    try {
      if (isDepense) {
        await dispatch(
          createCharge({
            libelle: formData.libelle,
            montant,
            date: new Date(formData.dateOperation).toISOString(),
            typeCharge: formData.nature,
            idPole,
          })
        ).unwrap();
      } else {
        await dispatch(
          createRevenu({
            libelle: formData.libelle,
            montant,
            date: new Date(formData.dateOperation).toISOString(),
            typeRevenu: formData.typeRevenu || 'Encaissement',
            idPole,
          })
        ).unwrap();
      }
      onCreated?.();
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, isDepense ? "Erreur lors de l'ajout de la dépense" : "Erreur lors de l'ajout du revenu"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleMontantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setFormData((prev) => ({ ...prev, montant: rawValue }));
  };

  const inputBase =
    'w-full h-9 bg-[var(--panel-deep)] border border-[var(--line)] rounded-md pl-9 pr-3 text-sm text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/20 transition-all';

  const sectionLabel =
    'text-[10px] font-semibold text-[var(--t3)] uppercase tracking-wider block border-b border-[var(--line)] pb-1.5 mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-lg w-full max-w-xl shadow-[var(--shadow-modal)] overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--line)]">
          <div>
            <h2 className="text-sm font-semibold text-[var(--t1)]">
              {isDepense ? 'Nouvelle dépense' : 'Nouveau revenu'}
            </h2>
            <p className="text-[11px] text-[var(--t3)] mt-0.5">Informations comptables</p>
          </div>

          <button
            onClick={onClose}
            className="text-[var(--t3)] hover:text-[var(--t1)] p-1.5 hover:bg-[var(--surface-hover)] rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="space-y-3">
            <span className={sectionLabel}>
              Détails de l'opération
            </span>

            <div className={`grid grid-cols-1 ${isDepense ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-3`}>
              <div className={`${isDepense ? 'md:col-span-2' : ''} space-y-1.5`}>
                <label className="block text-xs font-medium text-[var(--t2)]">
                  Libellé <span className="text-[var(--danger)]">*</span>
                </label>
                <div className="relative flex items-center">
                  <FileText className="w-3.5 h-3.5 text-[var(--t3)] absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={formData.libelle}
                    onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                    placeholder={isDepense ? "Loyer, achat matériel..." : "Paiement prestation..."}
                    className={inputBase}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[var(--t2)]">
                  Montant (Ar) <span className="text-[var(--danger)]">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={formData.montant}
                    onChange={handleMontantChange}
                    placeholder="0"
                    className={`${inputBase} pl-3 pr-10 text-right font-mono font-semibold tabular-nums`}
                  />
                  <span className="absolute right-3 text-[11px] font-medium text-[var(--t3)] pointer-events-none">
                    Ar
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <span className={sectionLabel}>
              Classification & date
            </span>

            <div className={`grid grid-cols-1 ${isDepense ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-3`}>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[var(--t2)]">
                  Pôle <span className="text-[var(--danger)]">*</span>
                </label>
                <div className="relative flex items-center">
                  <Building2 className="w-3.5 h-3.5 text-[var(--t3)] absolute left-3 pointer-events-none" />
                  <select
                    value={formData.pole}
                    onChange={(e) => setFormData({ ...formData, pole: e.target.value })}
                    required
                    className={`${inputBase} appearance-none cursor-pointer text-[var(--t2)]`}
                  >
                    <option value="" disabled>Choisir un pôle...</option>
                    {poles.map((pole) => (
                      <option key={pole.id} value={String(pole.id)}>
                        {pole.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {isDepense && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[var(--t2)]">
                    Nature <span className="text-[var(--danger)]">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Tag className="w-3.5 h-3.5 text-[var(--t3)] absolute left-3 pointer-events-none" />
                    <select
                      value={formData.nature}
                      onChange={(e) => setFormData({ ...formData, nature: e.target.value })}
                      className={`${inputBase} appearance-none cursor-pointer text-[var(--t2)]`}
                    >
                      <option value="FIXE">Charge fixe</option>
                      <option value="VARIABLE">Charge variable</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[var(--t2)]">
                  Date <span className="text-[var(--danger)]">*</span>
                </label>
                <div className="relative flex items-center">
                  <Calendar className="w-3.5 h-3.5 text-[var(--t3)] absolute left-3 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={formData.dateOperation}
                    onChange={(e) => setFormData({ ...formData, dateOperation: e.target.value })}
                    className={inputBase}
                  />
                </div>
              </div>
            </div>

            {!isDepense && (
              <div className="space-y-1.5 md:max-w-sm">
                <label className="block text-xs font-medium text-[var(--t2)]">
                  Type de revenu
                </label>
                <div className="relative flex items-center">
                  <Hash className="w-3.5 h-3.5 text-[var(--t3)] absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={formData.typeRevenu}
                    onChange={(e) => setFormData({ ...formData, typeRevenu: e.target.value })}
                    placeholder="Écolage, prestation..."
                    className={inputBase}
                  />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="px-3 py-2 rounded-md bg-[var(--danger-bg)] border border-[var(--danger-line)] text-[var(--danger)] text-xs flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" />
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--line)]">
            <span className="text-[11px] text-[var(--t3)]">
              <span className="text-[var(--danger)]">*</span> obligatoire
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-3.5 py-2 bg-[var(--surface-hover)] hover:bg-[var(--chip)] text-[var(--t2)] rounded-md text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-[#1a1408] font-semibold rounded-md text-sm transition-colors flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Enregistrer
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

export default NewTransactionModal;
