import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  FileText, 
  MoreVertical, 
  TrendingDown, 
  Layers, 
  Zap, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

interface ChargeItem {
  id: string;
  libelle: string;
  pole: 'ÉVÉNEMENTIEL' | 'IT' | 'FORMATION' | 'TOURISME';
  type: 'FIXE' | 'VARIABLE';
  montant: string;
  datePaiement: string;
}

const mockCharges: ChargeItem[] = [
  {
    id: '1',
    libelle: 'Loyer Siège',
    pole: 'ÉVÉNEMENTIEL',
    type: 'FIXE',
    montant: '1 200 000 Ar',
    datePaiement: '01 Août 2026',
  },
  {
    id: '2',
    libelle: 'Serveurs AWS',
    pole: 'IT',
    type: 'VARIABLE',
    montant: '850 000 Ar',
    datePaiement: '05 Août 2026',
  },
  {
    id: '3',
    libelle: 'Achat Matériel',
    pole: 'FORMATION',
    type: 'VARIABLE',
    montant: '1 200 000 Ar',
    datePaiement: '10 Août 2026',
  },
  {
    id: '4',
    libelle: 'Frais de Déplacement',
    pole: 'TOURISME',
    type: 'VARIABLE',
    montant: '450 000 Ar',
    datePaiement: '12 Août 2026',
  },
];

interface ChargesTableProps {
  onOpenModal?: () => void;
}

export const ChargesTable: React.FC<ChargesTableProps> = ({ onOpenModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPole, setSelectedPole] = useState('Tous les pôles');
  const [selectedType, setSelectedType] = useState('Toutes');

  const getPoleBadgeStyle = (pole: ChargeItem['pole']) => {
    switch (pole) {
      case 'ÉVÉNEMENTIEL':
        return 'bg-[#2D1B18] text-[#F97316] border border-[#7C2D12]/40';
      case 'IT':
        return 'bg-[#1E293B] text-[#38BDF8] border border-[#0284C7]/30';
      case 'FORMATION':
        return 'bg-[#064E3B] text-[#34D399] border border-[#059669]/30';
      case 'TOURISME':
        return 'bg-[#134E4A] text-[#2DD4BF] border border-[#0D9488]/30';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  return (
    <div className="space-y-6 text-gray-100">
      
      {/* 1. Cartes KPI (Total, Fixes, Variables) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Charges Totales */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 border-l-4 border-l-red-500 shadow-lg relative overflow-hidden">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Charges Totales</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-red-400">6 900 000 Ar</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Total décaissé ce mois</p>
          <TrendingDown className="w-16 h-16 text-red-500/10 absolute right-4 bottom-2 pointer-events-none" />
        </div>

        {/* Charges Fixes */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 border-l-4 border-l-blue-500 shadow-lg relative overflow-hidden">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Charges Fixes</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-blue-400">4 200 000 Ar</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Dépenses récurrentes</p>
          <Layers className="w-16 h-16 text-blue-500/10 absolute right-4 bottom-2 pointer-events-none" />
        </div>

        {/* Charges Variables */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 border-l-4 border-l-purple-500 shadow-lg relative overflow-hidden">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Charges Variables</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-purple-400">2 700 000 Ar</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Dépenses ponctuelles</p>
          <Zap className="w-16 h-16 text-purple-500/10 absolute right-4 bottom-2 pointer-events-none" />
        </div>

      </div>

      {/* 2. Filtres et Tableau */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 shadow-lg">
        
        {/* Barre d'outils */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            
            {/* Input recherche */}
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une dépense..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0B0F17] border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Select Pôle */}
            <select
              value={selectedPole}
              onChange={(e) => setSelectedPole(e.target.value)}
              className="bg-[#0B0F17] border border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-amber-500"
            >
              <option value="Tous les pôles">Tous les pôles</option>
              <option value="IT">Pôle IT</option>
              <option value="FORMATION">Formation</option>
              <option value="ÉVÉNEMENTIEL">Événementiel</option>
              <option value="TOURISME">Tourisme</option>
            </select>

            {/* Select Type */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-[#0B0F17] border border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-amber-500"
            >
              <option value="Toutes">Toutes les natures</option>
              <option value="FIXE">Fixe</option>
              <option value="VARIABLE">Variable</option>
            </select>

          </div>

          {/* Bouton Ajouter */}
          <button 
            onClick={onOpenModal}
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Ajouter une dépense
          </button>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">Libellé de la dépense</th>
                <th className="py-3 px-4">Pôle d'affectation</th>
                <th className="py-3 px-4">Nature</th>
                <th className="py-3 px-4 text-right">Montant Décaissé</th>
                <th className="py-3 px-4">Date de paiement</th>
                <th className="py-3 px-4 text-center">Justificatif</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-sm">
              {mockCharges.map((charge) => (
                <tr key={charge.id} className="hover:bg-gray-800/30 transition-colors">
                  
                  {/* Libellé */}
                  <td className="py-4 px-4 font-medium text-white">{charge.libelle}</td>
                  
                  {/* Pôle */}
                  <td className="py-4 px-4">
                    <span className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded-md ${getPoleBadgeStyle(charge.pole)}`}>
                      {charge.pole}
                    </span>
                  </td>

                  {/* Nature (Fixe / Variable) */}
                  <td className="py-4 px-4">
                    {charge.type === 'FIXE' ? (
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-blue-300 bg-blue-950/80 border border-blue-800/50 rounded">
                        FIXE
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-purple-300 bg-[#2E1065] border border-purple-800/50 rounded">
                        VARIABLE
                      </span>
                    )}
                  </td>

                  {/* Montant Décaissé */}
                  <td className="py-4 px-4 text-right font-bold text-red-400">
                    - {charge.montant}
                  </td>

                  {/* Date de paiement */}
                  <td className="py-4 px-4 text-gray-400 text-xs">
                    {charge.datePaiement}
                  </td>

                  {/* Justificatif */}
                  <td className="py-4 px-4 text-center">
                    <button className="text-gray-400 hover:text-amber-500 transition-colors">
                      <FileText className="w-4 h-4 mx-auto" />
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <button className="text-gray-400 hover:text-white p-1 rounded transition-colors">
                      <MoreVertical className="w-4 h-4 ml-auto" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800 text-xs text-gray-400">
          <span>Affichage de 1 à 4 sur 34 dépenses</span>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg bg-[#0B0F17] border border-gray-800 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg bg-[#0B0F17] border border-gray-800 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChargesTable;