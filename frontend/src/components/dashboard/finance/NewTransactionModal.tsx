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

  const [prevOpen, setPrevOpen] = useState(isOpen);
  const [prevType, setPrevType] = useState(defaultType);
  if (isOpen !== prevOpen || defaultType !== prevType) {
    setPrevOpen(isOpen);
    setPrevType(defaultType);
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
  }

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[var(--panel)] border border-[var(--border-subtle)] rounded-2xl w-full max-w-2xl shadow-2xl text-[var(--t1)] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-subtle)] bg-[var(--panel-deep)]/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${
              isDepense
                ? 'bg-[var(--danger)]/10 border-[var(--danger)]/30 text-[var(--danger)]'
                : 'bg-[var(--positive)]/10 border-[var(--positive)]/30 text-[var(--positive)]'
            }`}>
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--t1)]">
                {isDepense ? 'Saisie d\'une Dépense' : 'Enregistrement d\'une Recette'}
              </h2>
              <p className="text-xs text-[var(--t3)] mt-0.5">Remplissez les informations comptables obligatoires</p>
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
          {/* Section 1: Informations Générales */}
          <div className="space-y-4">
            <span className="text-[11px] font-bold text-[var(--honey)] uppercase tracking-widest block border-b border-[var(--border-subtle)] pb-1">
              1. Détails de l'opération
            </span>

            <div className={`grid grid-cols-1 ${isDepense ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
              {/* Libellé */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--t2)]">
                  Libellé de la transaction <span className="text-[var(--honey)]">*</span>
                </label>
                <div className="relative flex items-center">
                  <FileText className="w-4 h-4 text-[var(--t3)] absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={formData.libelle}
                    onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                    placeholder={isDepense ? "Ex: Loyer Siège, Achat matériel IT..." : "Ex: Paiement Prestation Client X"}
                    className="field h-10 pl-9 pr-3 text-sm w-full"
                  />
                </div>
              </div>

              {/* Montant */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--t2)]">
                  Montant (Ariary) <span className="text-[var(--honey)]">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={formData.montant}
                    onChange={handleMontantChange}
                    placeholder="0"
                    className="field h-10 pl-3 pr-10 text-sm font-semibold text-right w-full"
                  />
                  <span className="absolute right-3 text-xs font-bold text-[var(--t3)] pointer-events-none">
                    Ar
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Classification & Calendrier */}
          <div className="space-y-4">
            <span className="text-[11px] font-bold text-[var(--honey)] uppercase tracking-widest block border-b border-[var(--border-subtle)] pb-1">
              2. Classification & Calendrier
            </span>

            <div className={`grid grid-cols-1 ${isDepense ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
              {/* Pôle d'affectation */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--t2)]">
                  Pôle d'affectation <span className="text-[var(--honey)]">*</span>
                </label>
                <div className="relative flex items-center">
                  <Building2 className="w-4 h-4 text-[var(--t3)] absolute left-3 pointer-events-none" />
                  <select
                    value={formData.pole}
                    onChange={(e) => setFormData({ ...formData, pole: e.target.value })}
                    required
                    className="field h-10 pl-9 pr-3 text-sm w-full appearance-none cursor-pointer"
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

              {/* Nature de la charge (Dépenses uniquement) */}
              {isDepense && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[var(--t2)]">
                    Nature de la charge <span className="text-[var(--honey)]">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Tag className="w-4 h-4 text-[var(--t3)] absolute left-3 pointer-events-none" />
                    <select
                      value={formData.nature}
                      onChange={(e) => setFormData({ ...formData, nature: e.target.value })}
                      className="field h-10 pl-9 pr-3 text-sm w-full appearance-none cursor-pointer"
                    >
                      <option value="FIXE">Charge Fixe (Loyer, Salaire...)</option>
                      <option value="VARIABLE">Charge Variable (Prestation, Achat...)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Date d'opération */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--t2)]">
                  {isDepense ? "Date de décaissement" : "Date d'encaissement"} <span className="text-[var(--honey)]">*</span>
                </label>
                <div className="relative flex items-center">
                  <Calendar className="w-4 h-4 text-[var(--t3)] absolute left-3 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={formData.dateOperation}
                    onChange={(e) => setFormData({ ...formData, dateOperation: e.target.value })}
                    className="field h-10 pl-9 pr-3 text-sm w-full [color-scheme:dark] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Type de revenu (Recettes uniquement) */}
            {!isDepense && (
              <div className="space-y-1.5 md:max-w-md">
                <label className="block text-xs font-semibold text-[var(--t2)]">
                  Type de revenu
                </label>
                <div className="relative flex items-center">
                  <Hash className="w-4 h-4 text-[var(--t3)] absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={formData.typeRevenu}
                    onChange={(e) => setFormData({ ...formData, typeRevenu: e.target.value })}
                    placeholder="Ex: Ecolage, Prestation..."
                    className="field h-10 pl-9 pr-3 text-sm w-full"
                  />
                </div>
              </div>
            )}
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
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Enregistrer l'opération
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