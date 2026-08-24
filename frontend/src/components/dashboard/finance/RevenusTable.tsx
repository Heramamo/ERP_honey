import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  FileText, 
  MoreVertical, 
  TrendingUp, 
  Receipt, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

interface RevenuItem {
  id: string;
  client: string;
  pole: 'FORMATION' | 'TOURISME' | 'ÉVÉNEMENTIEL' | 'IT';
  montantNet: string;
  dateEncaissement: string;
}

const mockRevenus: RevenuItem[] = [
  {
    id: '1',
    client: 'École de Management',
    pole: 'FORMATION',
    montantNet: '12 500 000 Ar',
    dateEncaissement: '14 Août 2026',
  },
  {
    id: '2',
    client: 'Ministère du Tourisme',
    pole: 'TOURISME',
    montantNet: '8 200 000 Ar',
    dateEncaissement: '12 Août 2026',
  },
  {
    id: '3',
    client: 'Sitony Randria',
    pole: 'ÉVÉNEMENTIEL',
    montantNet: '4 500 000 Ar',
    dateEncaissement: '18 Août 2026',
  },
  {
    id: '4',
    client: 'AWS Enterprise',
    pole: 'IT',
    montantNet: '1 200 000 Ar',
    dateEncaissement: '05 Août 2026',
  },
];

interface RevenusTableProps {
  onOpenModal?: () => void;
}

export const RevenusTable: React.FC<RevenusTableProps> = ({ onOpenModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPole, setSelectedPole] = useState('Tous les Pôles');

  const getPoleBadgeStyle = (pole: RevenuItem['pole']) => {
    switch (pole) {
      case 'FORMATION':
        return 'bg-[#064E3B] text-[#34D399] border border-[#059669]/30';
      case 'TOURISME':
        return 'bg-[#134E4A] text-[#2DD4BF] border border-[#0D9488]/30';
      case 'ÉVÉNEMENTIEL':
        return 'bg-[#2D1B18] text-[#F97316] border border-[#7C2D12]/40';
      case 'IT':
        return 'bg-[#1E293B] text-[#38BDF8] border border-[#0284C7]/30';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  return (
    <div className="space-y-6 text-gray-100">
      
      {/* 1. Cartes KPI (Revenus totalement encaissés) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Total Encaissé Ce Mois */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 border-l-4 border-l-emerald-500 shadow-lg relative overflow-hidden">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Encaissé Ce Mois</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-emerald-400">26 400 000 Ar</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Recettes effectives en trésorerie</p>
          <TrendingUp className="w-16 h-16 text-emerald-500/10 absolute right-4 bottom-2 pointer-events-none" />
        </div>

        {/* Nombre d'Encaissements */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 border-l-4 border-l-teal-500 shadow-lg relative overflow-hidden">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nombre d'Encaissements</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-white">18</span>
            <span className="text-sm font-medium text-gray-400">opérations</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Paiements validés et perçus</p>
          <Receipt className="w-16 h-16 text-teal-500/10 absolute right-4 bottom-2 pointer-events-none" />
        </div>

      </div>

      {/* 2. Barre d'outils et Tableau */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 shadow-lg">
        
        {/* Filtres & Bouton d'action */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            
            {/* Input de recherche */}
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un client ou une prestation..."
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
              <option value="Tous les Pôles">Tous les Pôles</option>
              <option value="FORMATION">Pôle Formation</option>
              <option value="TOURISME">Tourisme</option>
              <option value="ÉVÉNEMENTIEL">Événementiel</option>
              <option value="IT">Pôle IT</option>
            </select>

          </div>

          {/* Bouton Nouvel Encaissement */}
          <button 
            onClick={onOpenModal}
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Nouvel Encaissement
          </button>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">Client / Source</th>
                <th className="py-3 px-4">Pôle d'affectation</th>
                <th className="py-3 px-4 text-right">Montant Encaissé</th>
                <th className="py-3 px-4">Date d'encaissement</th>
                <th className="py-3 px-4 text-center">Facture / Reçu</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-sm">
              {mockRevenus.map((item) => (
                <tr key={item.id} className="hover:bg-gray-800/30 transition-colors">
                  
                  {/* Client / Source */}
                  <td className="py-4 px-4 font-medium text-white">{item.client}</td>
                  
                  {/* Pôle */}
                  <td className="py-4 px-4">
                    <span className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded-md ${getPoleBadgeStyle(item.pole)}`}>
                      {item.pole}
                    </span>
                  </td>

                  {/* Montant Encaissé */}
                  <td className="py-4 px-4 text-right font-bold text-emerald-400">
                    + {item.montantNet}
                  </td>

                  {/* Date d'encaissement */}
                  <td className="py-4 px-4 text-gray-400 text-xs">
                    {item.dateEncaissement}
                  </td>

                  {/* Facture / Reçu */}
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
          <span>Affichage de 1 à 4 sur 18 encaissements</span>
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

export default RevenusTable;