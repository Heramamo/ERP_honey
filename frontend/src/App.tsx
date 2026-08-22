import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';

import { store } from './store';
import { DashboardLayout } from './components/layout/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import UnauthorizedPage from './pages/Unauthorizedpage';
import DashboardPage from './pages/DashboardPage';
import PlaceholderPage from './pages/PlaceholderPage';
import ProtectedPublicRoute from './components/ProtectedPublicRoute';
import HrPayrollPage from './pages/HrPayrollPage';
import TeachersTable from './components/dashboard/hr/TeachersTable';
import PayrollTable from './components/dashboard/hr/PayrollTable';
import SaisiesTable from './components/dashboard/teacher/SaisiesTable';
import RoleGuard from './components/RoleGuard';

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedPublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route path="/complete-profile" element={<CompleteProfilePage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route
                path="/dashboard/feuilles-de-saisie"
                element={
                  <RoleGuard allowedRoles={['ADMIN', 'RH']}>
                    <HrPayrollPage allowedRoles={['ADMIN', 'RH']} />
                  </RoleGuard>
                }
              />
              <Route
                path="/dashboard/enseignants"
                element={
                  <RoleGuard allowedRoles={['ADMIN', 'RH']}>
                    <TeachersTable role="admin" allowedRoles={['ADMIN', 'RH']} />
                  </RoleGuard>
                }
              />
              <Route
                path="/dashboard/finance"
                element={
                  <RoleGuard allowedRoles={['ADMIN', 'RH', 'FINANCE']}>
                    <PlaceholderPage title="Finance" />
                  </RoleGuard>
                }
              />
              <Route
                path="/dashboard/mes-heures"
                element={
                  <RoleGuard allowedRoles={['ENSEIGNANT']}>
                    <PayrollTable allowedRoles={['ENSEIGNANT']} />
                  </RoleGuard>
                }
              />
              <Route
                path="/dashboard/feuilles-de-temps"
                element={
                  <RoleGuard allowedRoles={['ENSEIGNANT']}>
                    <SaisiesTable />
                  </RoleGuard>
                }
              />
              <Route
                path="/dashboard/paie"
                element={
                  <RoleGuard allowedRoles={['ENSEIGNANT']}>
                    <PlaceholderPage title="Ma Paie" />
                  </RoleGuard>
                }
              />
              <Route path="/dashboard/settings" element={<PlaceholderPage title="Paramètres" />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
