import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { AuthHeader } from '../ui/AuthHeader';
import { InputField } from '../ui/InputField';
import { PasswordInput } from '../ui/PasswordInput';
import { PrimaryButton } from '../ui/PrimaryButton';

export function CompleteTeacherProfileForm() {
  const [status, setStatus] = useState<'vacataire' | 'permanent' | 'prestataire'>('vacataire');

  const statusOptions = [
    { value: 'vacataire', label: 'Vacataire' },
    { value: 'permanent', label: 'Permanent' },
    { value: 'prestataire', label: 'Prestataire' },
  ] as const;

  return (
    <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-white">
      <AuthHeader
        tag="PREMIÈRE CONNEXION"
        title="Finalisation de votre profil Enseignant"
        subtitle="Renseignez vos informations pour configurer votre accès à l'ERP."
      />

      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        {/* Infos pré-remplies par l'Admin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Nom" value="ANDRIAMIHAJA" disabled />
          <InputField label="Prénom" value="Henitsoa" disabled />
        </div>

        <InputField
          label="Adresse Email (Identifiant)"
          type="email"
          value="henitsoa.andriamihaja@honeygroup.mg"
          disabled
        />

        <div className="pt-2 border-t border-slate-100" />

        {/* Sélection moderne du Statut (Sélecteur à pilules / Segmented Buttons) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Statut Enseignant
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
            {statusOptions.map((opt) => {
              const isActive = status === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Taux horaire et Mot de passe unique */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Taux horaire de base (Ar/h)"
            type="number"
            placeholder="ex: 15000"
          />
          <PasswordInput
            label="Nouveau mot de passe"
            placeholder="Définissez votre mot de passe"
          />
        </div>

        {/* Action principale */}
        <PrimaryButton icon={<CheckCircle2 className="w-4 h-4" />}>
          Valider et accéder à mon espace
        </PrimaryButton>
      </form>
    </div>
  );
}