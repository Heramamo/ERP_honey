import React, { useState } from 'react';
import { FinanceOverview } from '../components/dashboard/finance/FinanceOverview';
import { ChargesTable } from '../components/dashboard/finance/ChargesTable';
import { RevenusTable } from '../components/dashboard/finance/RevenusTable';
import { PoleReportsTable } from '../components/dashboard/finance/PoleReportsTable';
import { NewTransactionModal, type TransactionType } from '../components/dashboard/finance/NewTransactionModal';

type TabType = 'overview' | 'charges' | 'revenus' | 'reports';

// Configuration des titres et descriptions dynamiques par sous-section
const TABS_CONFIG: Record<TabType, { label: string; title: string; description: string }> = {
  overview: {
    label: "Vue d'ensemble",
    title: "Vue d'ensemble Financière",
    description: "Aperçu global de la trésorerie, du solde net et des indicateurs clés de performance.",
  },
  charges: {
    label: "Charges & Dépenses",
    title: "Gestion des Charges & Dépenses",
    description: "Suivi détaillé des charges fixes, variables et décaissements ventilés par pôle.",
  },
  revenus: {
    label: "Revenus & Recettes",
    title: "Gestion des Revenus & Recettes",
    description: "Historique et suivi des encaissements et prestations facturées.",
  },
  reports: {
    label: "Rapports & Bilans",
    title: "Rapports & Bilans Comptables",
    description: "Analyses de rentabilité analytique et bilans consolidés par pôle d'activité.",
  },
};

export const FinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>('DEPENSE');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpenModal = (type: TransactionType) => {
    setTransactionType(type);
    setIsModalOpen(true);
  };

  const handleCreated = () => {
    setRefreshKey((k) => k + 1);
  };

  const currentTab = TABS_CONFIG[activeTab];

  return (
    <div className="p-6 md:p-8 w-full max-w-[1600px] mx-auto text-[var(--t1)] space-y-6 font-sans">
      {/* Header avec Titre et Subtitle Dynamiques */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{currentTab.title}</h1>
          <p className="text-sm text-[var(--t3)] mt-1">{currentTab.description}</p>
        </div>
      </div>

      {/* Navigation par Onglets */}
      <div className="flex border-b border-[var(--line)] gap-7 text-sm overflow-x-auto">
        {(Object.keys(TABS_CONFIG) as TabType[]).map((tabKey) => {
          const tab = TABS_CONFIG[tabKey];
          return (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`pb-3 font-medium whitespace-nowrap transition-colors ${
                activeTab === tabKey
                  ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--t1)]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="pt-2">
        {activeTab === 'overview' && <FinanceOverview refreshKey={refreshKey} />}
        {activeTab === 'charges' && <ChargesTable onOpenModal={() => handleOpenModal('DEPENSE')} refreshKey={refreshKey} />}
        {activeTab === 'revenus' && <RevenusTable onOpenModal={() => handleOpenModal('RECETTE')} refreshKey={refreshKey} />}
        {activeTab === 'reports' && <PoleReportsTable />}
      </div>

      {/* Modale conditionnée par le type */}
      <NewTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultType={transactionType}
        onCreated={handleCreated}
      />
    </div>
  );
};

export default FinancePage;
