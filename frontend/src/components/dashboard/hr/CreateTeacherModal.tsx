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
    'w-full bg-[var(--panel-deep)] border border-[var(--border-subtle)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--t2)] placeholder-[var(--t3)]/60 focus:outline-none focus:border-[var(--honey)]/50 transition-colors';
  const labelClass = 'text-[11px] font-bold text-[var(--t3)] uppercase tracking-wider';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-md max-h-[85vh] bg-[var(--panel)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-y-auto scroll-thin">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--panel-deep)]">
          <h2 className="text-sm font-bold text-[var(--t1)] uppercase tracking-wider">Nouvel Enseignant</h2>
          <button
            onClick={handleClose}
            className="p-1.5 text-[var(--t3)] hover:text-[var(--t1)] hover:bg-[var(--chip)] rounded-lg transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Taux horaire (Ar/h)</label>
              <input
                type="number"
                required
                min="1"
                step="0.5"
                value={tauxHoraireBase}
                onChange={(e) => setTauxHoraireBase(e.target.value)}
                className={inputClass}
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
            <div className="px-4 py-3 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-lg border border-[var(--border-subtle)] text-sm font-semibold text-[var(--t2)] hover:bg-[var(--chip)] transition cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-honey font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeacherModal;
