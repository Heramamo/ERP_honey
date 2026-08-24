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
    'w-full bg-[#0e1118] border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#12161f] border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#0e1118]">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Nouvelle Saisie</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date</label>
              <input
                type="date"
                required
                max={getTodayLocal()}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setLocalError(null);
                }}
                className={`${inputClass} [color-scheme:dark]`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Type d'activité</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Heures de base</label>
              <input
                type="number"
                min="0"
                step="0.5"
                required
                value={heuresEffectuees}
                onChange={(e) => setHeuresEffectuees(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Heures supp.</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={heuresSupp}
                onChange={(e) => setHeuresSupp(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {(localError || error) && (
            <div className="px-4 py-3 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs">
              {localError ?? error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-slate-800 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm transition-colors shadow-lg shadow-amber-500/10 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSaisieModal;