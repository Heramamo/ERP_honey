import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { clearError as clearPaieError, generatePaie } from '../../../store/slices/paieSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { teacherService } from '../../../service/teacher.service';

interface GeneratePaieModalProps {
  open: boolean;
  onClose: () => void;
}

export const GeneratePaieModal: React.FC<GeneratePaieModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return <GeneratePaieModalForm onClose={onClose} />;
};

interface TeacherOption {
  id: number;
  utilisateur: {
    id_utilisateur: number;
    nom: string;
    prenom: string;
    email: string;
  };
}

const GeneratePaieModalForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const paieError = useAppSelector((state) => state.paie.error);

  const [enseignants, setEnseignants] = useState<TeacherOption[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [moisValue, setMoisValue] = useState(() => new Date().toISOString().slice(0, 7));
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await teacherService.getAll();
        if (!cancelled) setEnseignants(data);
      } catch {
        if (!cancelled) setLoadError("Impossible de charger la liste des enseignants");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleClose = () => {
    dispatch(clearPaieError());
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !moisValue) return;

    const [yearStr, monthStr] = moisValue.split('-');
    setSubmitting(true);
    try {
      await dispatch(
        generatePaie({
          userId: Number(selectedUserId),
          month: Number(monthStr),
          year: Number(yearStr),
        })
      ).unwrap();
      handleClose();
    } catch {
      // l'erreur est déjà exposée via le state Redux
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-[#0e1118] border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors';
  const labelClass = 'text-[11px] font-bold text-slate-400 uppercase tracking-wider';
  const error = loadError ?? paieError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-md bg-[#12161f] border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#0e1118]">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Générer une Fiche de Paie</h2>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className={labelClass}>Enseignant</label>
            {enseignants.length === 0 && !loadError ? (
              <div className="flex items-center gap-2 text-sm text-slate-400 py-2.5">
                <Loader2 className="w-4 h-4 animate-spin" /> Chargement...
              </div>
            ) : (
              <select
                required
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">Sélectionner un enseignant</option>
                {enseignants.map((ens) => (
                  <option key={ens.id} value={ens.utilisateur.id_utilisateur}>
                    {ens.utilisateur.nom} {ens.utilisateur.prenom} ({ens.utilisateur.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Période (mois)</label>
            <input
              type="month"
              required
              value={moisValue}
              onChange={(e) => setMoisValue(e.target.value)}
              className={`${inputClass} [color-scheme:dark]`}
            />
          </div>

          {error && (
            <div className="px-4 py-3 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
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
              {submitting ? 'Génération...' : 'Générer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneratePaieModal;
