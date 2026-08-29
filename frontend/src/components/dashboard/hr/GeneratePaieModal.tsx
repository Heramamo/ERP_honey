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
    'w-full bg-[var(--panel-deep)] border border-[var(--line)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--t2)] placeholder-slate-500 focus:outline-none focus:border-[var(--accent-muted)] transition-colors';
  const labelClass = 'text-[11px] font-bold text-[var(--t3)] uppercase tracking-wider';
  const error = loadError ?? paieError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-md max-h-[85vh] bg-[var(--panel)] border border-[var(--line)] rounded-2xl shadow-[var(--shadow-raised)] overflow-y-auto scroll-thin">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)] bg-[var(--panel-deep)]">
          <h2 className="text-sm font-bold text-[var(--t1)] uppercase tracking-wider">Générer une Fiche de Paie</h2>
          <button
            onClick={handleClose}
            className="p-1.5 text-[var(--t3)] hover:text-[var(--t1)] hover:bg-[var(--chip)] rounded-lg transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className={labelClass}>Enseignant</label>
            {enseignants.length === 0 && !loadError ? (
              <div className="flex items-center gap-2 text-sm text-[var(--t3)] py-2.5">
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
              className={`${inputClass}`}
            />
          </div>

          {error && (
            <div className="px-4 py-3 rounded-lg bg-[var(--danger-bg)] border border-[var(--danger-line)] text-[var(--danger)] text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-lg border border-[var(--line)] text-sm font-semibold text-[var(--t2)] hover:bg-[var(--chip)] transition cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-slate-950 font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
