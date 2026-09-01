import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { createSaisie, clearError } from '../../../store/slices/saisieSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';

interface CreateSaisieModalProps {
  open: boolean;
  onClose: () => void;
}

const ACTIVITE_TYPES = ['Cours', 'Préparation', 'Examen', 'Correction', 'Réunion', 'Encadrement'];

const getTodayLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const CreateSaisieModal: React.FC<CreateSaisieModalProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.saisies.error);

  const [date, setDate] = useState(getTodayLocal);
  const [typeActivite, setTypeActivite] = useState(ACTIVITE_TYPES[0]);
  const [heuresEffectuees, setHeuresEffectuees] = useState('1');
  const [heuresSupp, setHeuresSupp] = useState('0');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    if (date > getTodayLocal()) {
      setLocalError('La date ne peut pas être dans le futur.');
      return;
    }

    setLocalError(null);
    setSubmitting(true);
    dispatch(clearError());
    try {
      await dispatch(
        createSaisie({
          date: new Date(`${date}T12:00:00`).toISOString(),
          heuresEffectuees: Number(heuresEffectuees) || 0,
          heuresSupp: Number(heuresSupp) || 0,
          typeActivite,
        })
      ).unwrap();
      onClose();
    } catch {
      // l'erreur est déjà exposée via le state Redux
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-[var(--panel-deep)] border border-[var(--line)] rounded-md px-3 py-2 text-sm text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/20 transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-md max-h-[85vh] bg-[var(--panel)] border border-[var(--line)] rounded-lg shadow-[var(--shadow-raised)] overflow-y-auto scroll-thin">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--line)]">
          <h2 className="text-sm font-semibold text-[var(--t1)]">Nouvelle saisie</h2>
          <button
            onClick={onClose}
            className="p-1 text-[var(--t3)] hover:text-[var(--t1)] hover:bg-[var(--surface-hover)] rounded-md transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--t2)]">Date</label>
              <input
                type="date"
                required
                max={getTodayLocal()}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setLocalError(null);
                }}
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--t2)]">Type d'activité</label>
              <select
                value={typeActivite}
                onChange={(e) => setTypeActivite(e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                {ACTIVITE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--t2)]">Heures de base</label>
              <input
                type="number"
                min="0"
                step="0.5"
                required
                value={heuresEffectuees}
                onChange={(e) => setHeuresEffectuees(e.target.value)}
                className={`${inputClass} font-mono tabular-nums`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--t2)]">Heures supp.</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={heuresSupp}
                onChange={(e) => setHeuresSupp(e.target.value)}
                className={`${inputClass} font-mono tabular-nums`}
              />
            </div>
          </div>

          {(localError || error) && (
            <div className="px-3 py-2 rounded-md bg-[var(--danger-bg)] border border-[var(--danger-line)] text-[var(--danger)] text-xs">
              {localError ?? error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-md border border-[var(--line)] text-sm font-medium text-[var(--t2)] hover:bg-[var(--chip)] transition cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-[#1a1408] font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {submitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSaisieModal;
