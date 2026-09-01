import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { createTeacher, clearError } from '../../../store/slices/teacherSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';

interface CreateTeacherModalProps {
  open: boolean;
  onClose: () => void;
}

const STATUTS = ['Permanent', 'Vacataire', 'Prestataire'];

export const CreateTeacherModal: React.FC<CreateTeacherModalProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.teachers.error);

  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [tauxHoraireBase, setTauxHoraireBase] = useState('');
  const [statut, setStatut] = useState(STATUTS[0]);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleClose = () => {
    dispatch(clearError());
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !nom || !email || !motDePasse || !tauxHoraireBase) return;

    setSubmitting(true);
    dispatch(clearError());
    try {
      await dispatch(
        createTeacher({
          nom,
          prenom,
          email,
          mot_de_passe: motDePasse,
          tauxHoraireBase: Number(tauxHoraireBase),
          statut,
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
    'w-full bg-[var(--panel-deep)] border border-[var(--line)] rounded-md px-3 py-2 text-sm text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/20 transition-colors';
  const labelClass = 'text-xs font-medium text-[var(--t2)]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative w-full max-w-md max-h-[85vh] bg-[var(--panel)] border border-[var(--line)] rounded-lg shadow-[var(--shadow-raised)] overflow-y-auto scroll-thin">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--line)]">
          <h2 className="text-sm font-semibold text-[var(--t1)]">Nouvel enseignant</h2>
          <button
            onClick={handleClose}
            className="p-1 text-[var(--t3)] hover:text-[var(--t1)] hover:bg-[var(--surface-hover)] rounded-md transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={labelClass}>Prénom</label>
              <input
                type="text"
                required
                minLength={3}
                placeholder="Pytha"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Nom</label>
              <input
                type="text"
                required
                minLength={3}
                placeholder="Heriniaina"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Email</label>
            <input
              type="email"
              required
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              autoComplete='off'
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Mot de passe</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Minimum 6 caractères"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className={inputClass}
              autoComplete='off'
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={labelClass}>Taux horaire (Ar/h)</label>
              <input
                type="number"
                required
                min="1"
                step="0.5"
                value={tauxHoraireBase}
                onChange={(e) => setTauxHoraireBase(e.target.value)}
                className={`${inputClass} font-mono tabular-nums`}
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Statut</label>
              <select
                value={statut}
                onChange={(e) => setStatut(e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                {STATUTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="px-3 py-2 rounded-md bg-[var(--danger-bg)] border border-[var(--danger-line)] text-[var(--danger)] text-xs">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleClose}
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
              {submitting ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeacherModal;
