import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { DashboardLayout } from './components/layout/DashboardLayout';
import { AdminDashboard } from './pages/AdminDashboard';   
import { TeacherDashboard } from './pages/TeacherDashboard';   
import HrPayrollPage from './pages/HrPayrollPage';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CompleteProfilePage from './pages/CompleteProfilePage';

export const App: React.FC = () => {
  const [userRole, setUserRole] = useState<'admin' | 'rh' | 'enseignant'>('admin');
  const [userName] = useState<string>('Henitsoa ANDRIAMIHAJA');

  return (
    <BrowserRouter>
      {/* Sélecteur de rôle pour le développement */}
      <div className="fixed bottom-4 right-4 z-50 bg-slate-900 border border-slate-700 p-2 rounded-xl flex gap-2 text-xs font-bold text-white shadow-2xl">
        <span className="text-slate-400 self-center px-1 text-[10px] uppercase tracking-wider">Test Rôle:</span>
        <button
          onClick={() => setUserRole('admin')}
          className={`px-3 py-1.5 rounded-lg transition ${userRole === 'admin' ? 'bg-[#f59e0b] text-slate-950' : 'bg-slate-800 text-slate-400'}`}
        >
          Admin / RH
        </button>
        <button
          onClick={() => setUserRole('enseignant')}
          className={`px-3 py-1.5 rounded-lg transition ${userRole === 'enseignant' ? 'bg-[#f59e0b] text-slate-950' : 'bg-slate-800 text-slate-400'}`}
        >
          Enseignant
        </button>
        <a
          href="/complete-profile"
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 transition flex items-center"
        >
          Profil Enseignant
        </a>
      </div>

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage onLogin={() => {}} />} />
        <Route path="/register" element={<RegisterPage onRegisterSuccess={() => {}} />} />
        <Route path="/complete-profile" element={<CompleteProfilePage />} />

        {/* Route Parent /dashboard englobant le DashboardLayout */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout
              role={userRole}
              userName={userName}
              onLogout={() => console.log('Déconnexion')}
            />
          }
        >
          {/* /dashboard -> Affiche le dashboard principal (Admin ou Enseignant) */}
          <Route 
            index 
            element={userRole === 'enseignant' ? <TeacherDashboard /> : <AdminDashboard />} 
          />

          {/* /dashboard/rh-paie -> Affiche la page RH & Paie (Personnel & Enseignants par défaut) */}
          <Route path="rh-paie" element={<HrPayrollPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;