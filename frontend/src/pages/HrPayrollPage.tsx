import React, { useState } from 'react';
import TeachersTable from '../components/dashboard/hr/TeachersTable';
import HoursValidationTable from '../components/dashboard/hr/HoursValidationTable';
import PayrollTable from '../components/dashboard/hr/PayrollTable';

export const HrPayrollPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'personnel' | 'validation' | 'bulletins'>('personnel');

  return (
    <div className="w-full text-slate-100 font-sans p-6">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6 text-white">
        Personnel & Enseignants
      </h1>

      <div className="flex items-center gap-8 border-b border-slate-800/80 mb-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('personnel')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'personnel' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Personnel & Enseignants
          {activeTab === 'personnel' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('validation')}
          className={`pb-3 relative transition-colors flex items-center gap-2 ${
            activeTab === 'validation' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Validation des Heures
          <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full font-bold">
            4
          </span>
          {activeTab === 'validation' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('bulletins')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'bulletins' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Bulletins de Paie
          {activeTab === 'bulletins' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
          )}
        </button>
      </div>

      {activeTab === 'personnel' && <TeachersTable />}
      {activeTab === 'validation' && <HoursValidationTable />}
      {activeTab === 'bulletins' && <PayrollTable />}
    </div>
  );
};

export default HrPayrollPage;