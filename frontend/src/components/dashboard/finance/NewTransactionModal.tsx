import React, { useState, useEffect } from 'react';
import { 
  X, 
  UploadCloud, 
  Calendar, 
  Tag, 
  Building2, 
  CreditCard, 
  FileText, 
  Check, 
  AlertCircle,
  Hash
} from 'lucide-react';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'DEPENSE' | 'RECETTE';
}

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'DEPENSE',
}) => {
  const isDepense = defaultType === 'DEPENSE';

  const [formData, setFormData] = useState({
    libelle: '',
    montant: '',
    pole: 'IT',
    nature: 'FIXE', // Utilisé uniquement si isDepense === true
    dateOperation: new Date().toISOString().split('T')[0],
    modePaiement: 'VIREMENT',
    reference: '',
    notes: '',
    file: null as File | null,
  });

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        libelle: '',
        montant: '',
        reference: '',
        notes: '',
        file: null,
        nature: 'FIXE',
        dateOperation: new Date().toISOString().split('T')[0],
      }));
    }
  }, [isOpen, defaultType]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Transaction transmise:', { 
      type: defaultType, 
      ...formData,
      nature: isDepense ? formData.nature : undefined 
    });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleMontantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setFormData(prev => ({ ...prev, montant: rawValue }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#111827] border border-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl text-white overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 bg-[#0B0F17]/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${
              isDepense 
                ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  {isDepense ? 'Saisie d\'une Dépense' : 'Enregistrement d\'une Recette'}
                </h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isDepense 
                    ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                }`}>
                  {isDepense ? 'FLUX SORTANT' : 'FLUX ENTRANT'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Remplissez les informations comptables obligatoires</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 hover:bg-gray-800/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Section 1: Informations Générales */}
          <div className="space-y-4">
            <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest block border-b border-gray-800/80 pb-1">
              1. Détails Général de l'opération
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Libellé */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold text-gray-300">
                  Libellé de la transaction <span className="text-amber-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <FileText className="w-4 h-4 text-gray-500 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={formData.libelle}
                    onChange={e => setFormData({ ...formData, libelle: e.target.value })}
                    placeholder={isDepense ? "Ex: Loyer Siège, Achat matériel IT..." : "Ex: Paiement Prestation Client X"}
                    className="w-full h-10 bg-[#0B0F17] border border-gray-800 rounded-lg pl-9 pr-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Montant */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-300">
                  Montant (Ariary) <span className="text-amber-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={formData.montant}
                    onChange={handleMontantChange}
                    placeholder="0"
                    className="w-full h-10 bg-[#0B0F17] border border-gray-800 rounded-lg pl-3 pr-10 text-sm font-semibold text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all text-right"
                  />
                  <span className="absolute right-3 text-xs font-bold text-gray-500 pointer-events-none">
                    Ar
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Classification & Calendrier */}
          <div className="space-y-4">
            <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest block border-b border-gray-800/80 pb-1">
              2. Classification & Calendrier
            </span>

            <div className={`grid grid-cols-1 ${isDepense ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
              
              {/* Pôle d'affectation */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-300">
                  Pôle d'affectation
                </label>
                <div className="relative flex items-center">
                  <Building2 className="w-4 h-4 text-gray-500 absolute left-3 pointer-events-none" />
                  <select
                    value={formData.pole}
                    onChange={e => setFormData({ ...formData, pole: e.target.value })}
                    className="w-full h-10 bg-[#0B0F17] border border-gray-800 rounded-lg pl-9 pr-3 text-sm text-gray-200 focus:outline-none focus:border-amber-500/80 transition-all appearance-none cursor-pointer"
                  >
                    <option value="IT">Pôle IT</option>
                    <option value="FORMATION">Pôle Formation</option>
                    <option value="ÉVÉNEMENTIEL">Événementiel</option>
                    <option value="TOURISME">Tourisme</option>
                  </select>
                </div>
              </div>

              {/* Nature de la charge (Dépenses uniquement) */}
              {isDepense && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-300">
                    Nature de la charge <span className="text-amber-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Tag className="w-4 h-4 text-gray-500 absolute left-3 pointer-events-none" />
                    <select
                      value={formData.nature}
                      onChange={e => setFormData({ ...formData, nature: e.target.value })}
                      className="w-full h-10 bg-[#0B0F17] border border-gray-800 rounded-lg pl-9 pr-3 text-sm text-gray-200 focus:outline-none focus:border-amber-500/80 transition-all appearance-none cursor-pointer"
                    >
                      <option value="FIXE">Charge Fixe (Loyer, Salaire...)</option>
                      <option value="VARIABLE">Charge Variable (Prestation, Achat...)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Date d'opération */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-300">
                  {isDepense ? "Date de décaissement" : "Date d'encaissement"} <span className="text-amber-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Calendar className="w-4 h-4 text-gray-500 absolute left-3 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={formData.dateOperation}
                    onChange={e => setFormData({ ...formData, dateOperation: e.target.value })}
                    className="w-full h-10 bg-[#0B0F17] border border-gray-800 rounded-lg pl-9 pr-3 text-sm text-gray-200 focus:outline-none focus:border-amber-500/80 transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Section 3: Modalités de Règlement & Justificatif */}
          <div className="space-y-4">
            <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest block border-b border-gray-800/80 pb-1">
              3. Règlement & Pièce Justificative
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Mode de Paiement */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-300">
                  Mode de Règlement
                </label>
                <div className="relative flex items-center">
                  <CreditCard className="w-4 h-4 text-gray-500 absolute left-3 pointer-events-none" />
                  <select
                    value={formData.modePaiement}
                    onChange={e => setFormData({ ...formData, modePaiement: e.target.value })}
                    className="w-full h-10 bg-[#0B0F17] border border-gray-800 rounded-lg pl-9 pr-3 text-sm text-gray-200 focus:outline-none focus:border-amber-500/80 transition-all appearance-none cursor-pointer"
                  >
                    <option value="VIREMENT">Virement Bancaire</option>
                    <option value="MOBILE_MONEY">Mobile Money (MVola/Orange/Airtel)</option>
                    <option value="ESPECES">Espèces</option>
                    <option value="CHEQUE">Chèque</option>
                  </select>
                </div>
              </div>

              {/* N° Référence / Facture */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-300">
                  N° de Référence / Facture
                </label>
                <div className="relative flex items-center">
                  <Hash className="w-4 h-4 text-gray-500 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={formData.reference}
                    onChange={e => setFormData({ ...formData, reference: e.target.value })}
                    placeholder="Ex: FAC-2026-089"
                    className="w-full h-10 bg-[#0B0F17] border border-gray-800 rounded-lg pl-9 pr-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/80 transition-all"
                  />
                </div>
              </div>

            </div>

            {/* Zone de Téléversement */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-300">
                Pièce justificative (Facture, Reçu, Bon de commande)
              </label>
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    setFormData({ ...formData, file: e.dataTransfer.files[0] });
                  }
                }}
                className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${
                  isDragging 
                    ? 'border-amber-500 bg-amber-500/5' 
                    : formData.file 
                      ? 'border-emerald-500/50 bg-emerald-500/5' 
                      : 'border-gray-800 hover:border-gray-700 bg-[#0B0F17]/60'
                }`}
              >
                <input 
                  type="file" 
                  accept=".pdf,.png,.jpg,.jpeg" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                />

                {formData.file ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-semibold">
                    <Check className="w-4 h-4" />
                    <span>{formData.file.name}</span>
                    <span className="text-gray-500 text-[10px]">
                      ({(formData.file.size / 1024).toFixed(0)} KB)
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-gray-400">
                    <UploadCloud className="w-6 h-6 text-gray-500" />
                    <p className="text-xs">
                      <span className="text-amber-500 font-medium">Cliquez pour téléverser</span> ou glissez un fichier ici
                    </p>
                    <p className="text-[10px] text-gray-500">PDF, PNG, JPG (Max 5Mo)</p>
                  </div>
                )}
              </div>
            </div>

          </div>

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
                className="px-4 py-2 bg-gray-800/80 hover:bg-gray-800 text-gray-300 rounded-lg text-sm font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg text-sm transition-colors shadow-lg shadow-amber-500/10 flex items-center gap-2"
              >
                Enregistrer l'opération
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default NewTransactionModal;