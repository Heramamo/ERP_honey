import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  Info, 
  Laptop, 
  GraduationCap, 
  Sparkles, 
  Compass, 
  FileSpreadsheet, 
  FileText, 
  FolderArchive 
} from 'lucide-react';

interface PoleBilan {
  id: string;
  nom: string;
  icon: React.ElementType;
  iconBg: string;
  revenusBruts: string;
  chargesFixes: string;
  chargesVariables: string;
  beneficeNet: string;
  margeNette: string;
}

const mockPoleBilans: PoleBilan[] = [
  {
    id: 'it',
    nom: 'Pôle IT',
    icon: Laptop,
    iconBg: 'bg-blue-500/20 text-blue-400',
    revenusBruts: '145 000 000',
    chargesFixes: '22 500 000',
    chargesVariables: '18 200 000',
    beneficeNet: '104 300 000',
    margeNette: '71.9%',
  },
  {
    id: 'formation',
    nom: 'Formation',
    icon: GraduationCap,
    iconBg: 'bg-purple-500/20 text-purple-400',
    revenusBruts: '85 500 000',
    chargesFixes: '15 000 000',
    chargesVariables: '8 500 000',
    beneficeNet: '62 000 000',
    margeNette: '72.5%',
  },
  {
    id: 'evenementiel',
    nom: 'Événementiel',
    icon: Sparkles,
    iconBg: 'bg-orange-500/20 text-orange-400',
    revenusBruts: '120 000 000',
    chargesFixes: '35 000 000',
    chargesVariables: '45 000 000',
    beneficeNet: '40 000 000',
    margeNette: '33.3%',
  },
  {
    id: 'tourisme',
    nom: 'Tourisme',
    icon: Compass,
    iconBg: 'bg-teal-500/20 text-teal-400',
    revenusBruts: '210 000 000',
    chargesFixes: '42 000 000',
    chargesVariables: '75 000 000',
    beneficeNet: '93 000 000',
    margeNette: '44.2%',
  },
];

const mockArchives = [
  { id: '1', nom: 'Bilan_Financier_Ao...', taille: '2.4 MB', date: '01 Sept' },
  { id: '2', nom: 'Bilan_Financier_Jui...', taille: '2.1 MB', date: '01 Août' },
  { id: '3', nom: 'Bilan_Financier_Jui...', taille: '2.5 MB', date: '01 Juil' },
];

export const PoleReportsTable: React.FC = () => {
  return (
    <div className="space-y-6 text-gray-100">
      
      {/* 1. Cartes KPI Consolidation Financiére */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* TOTAL REVENUS */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 border-l-4 border-l-emerald-500 shadow-lg relative overflow-hidden">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Revenus</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-white">560 500 000 Ar</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>Revenus bruts</span>
          </div>
        </div>

        {/* TOTAL CHARGES */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 border-l-4 border-l-red-500 shadow-lg relative overflow-hidden">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Charges</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-white">261 200 000 Ar</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-red-400 font-medium">
            <TrendingDown className="w-4 h-4" />
            <span>Charges consolidées</span>
          </div>
        </div>

        {/* BÉNÉFICE NET */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 border-l-4 border-l-amber-500 shadow-lg relative overflow-hidden">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bénéfice Net</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-amber-500">299 300 000 Ar</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-400 font-medium">
            <Scale className="w-4 h-4 text-amber-500" />
            <span>Marge nette globale : <strong>53.4%</strong></span>
          </div>
        </div>

      </div>

      {/* 2. Tableau de Rentabilité par Pôle */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 shadow-lg space-y-4">
        
        {/* Formula Banner */}
        <div className="flex items-center gap-2 bg-[#0B0F17] border border-gray-800/80 rounded-lg px-4 py-2.5 text-xs text-gray-400 w-fit">
          <Info className="w-4 h-4 text-gray-400 shrink-0" />
          <span>
            <strong className="text-gray-200">Bénéfice Net</strong> = Total Revenus - (Charges Fixes + Charges Variables)
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">Pôle d'activité</th>
                <th className="py-3 px-4 text-right">Revenus Bruts (Ar)</th>
                <th className="py-3 px-4 text-right">Charges Fixes (Ar)</th>
                <th className="py-3 px-4 text-right">Charges Variables (Ar)</th>
                <th className="py-3 px-4 text-right">Bénéfice Net (Ar)</th>
                <th className="py-3 px-4 text-right">Marge Nette (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-sm">
              {mockPoleBilans.map((pole) => {
                const IconComponent = pole.icon;
                return (
                  <tr key={pole.id} className="hover:bg-gray-800/30 transition-colors">
                    
                    {/* Pôle Name & Icon */}
                    <td className="py-4 px-4 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${pole.iconBg}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span>{pole.nom}</span>
                      </div>
                    </td>

                    {/* Revenus Bruts */}
                    <td className="py-4 px-4 text-right text-gray-200 font-medium">
                      {pole.revenusBruts}
                    </td>

                    {/* Charges Fixes */}
                    <td className="py-4 px-4 text-right text-gray-200 font-medium">
                      {pole.chargesFixes}
                    </td>

                    {/* Charges Variables */}
                    <td className="py-4 px-4 text-right text-gray-200 font-medium">
                      {pole.chargesVariables}
                    </td>

                    {/* Bénéfice Net */}
                    <td className="py-4 px-4 text-right font-bold text-emerald-400">
                      {pole.beneficeNet}
                    </td>

                    {/* Marge Nette Badge */}
                    <td className="py-4 px-4 text-right">
                      <span className="inline-block px-2.5 py-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                        {pole.margeNette}
                      </span>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Section Rapports Téléchargeables */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Rapports Téléchargeables</h3>
            <p className="text-xs text-gray-400">Générez ou téléchargez les bilans archivés.</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-[#0B0F17] hover:bg-gray-800 border border-gray-800 text-gray-200 text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Exporter en Excel
            </button>

            <button className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-amber-500/10">
              Générer Bilan PDF
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {mockArchives.map((archive) => (
            <div 
              key={archive.id}
              className="bg-[#111827] border border-gray-800 hover:border-gray-700 rounded-xl p-4 flex items-center gap-3 transition-all cursor-pointer group"
            >
              <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate group-hover:text-amber-500 transition-colors">
                  {archive.nom}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {archive.taille} • {archive.date}
                </p>
              </div>
            </div>
          ))}

          <div className="bg-[#111827] border border-gray-800 hover:border-amber-500/50 rounded-xl p-4 flex items-center justify-center gap-2 transition-all cursor-pointer text-gray-300 hover:text-amber-500 group">
            <FolderArchive className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors" />
            <span className="text-xs font-semibold">Voir toutes les archives</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PoleReportsTable;