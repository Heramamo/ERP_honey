import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { DashboardLayout } from './components/layout/DashboardLayout';
import { AdminDashboard } from './pages/AdminDashboard';  
import { TeacherDashboard } from './pages/TeacherDashboard';   

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CompleteProfilePage from './pages/CompleteProfilePage';

export const App: React.FC = () => {
  // 💡 Changez 'admin' par 'enseignant' pour afficher directement la vue enseignant
  const [userRole, setUserRole] = useState<'admin' | 'rh' | 'enseignant'>('admin');
  const [userName] = useState<string>('Henitsoa ANDRIAMIHAJA');

  return (
    <BrowserRouter>
      {/* Sélecteur rapide de rôle & accès de test pour le dev */}
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

        {/* Route de finalisation de profil (1ère connexion enseignant) */}
        <Route path="/complete-profile" element={<CompleteProfilePage />} />

        {/* Dashboard principal adaptatif */}
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
          {/* Affiche AdminDashboard ou TeacherDashboard selon le rôle */}
          <Route 
            index 
            element={userRole === 'enseignant' ? <TeacherDashboard /> : <AdminDashboard />} 
          />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;