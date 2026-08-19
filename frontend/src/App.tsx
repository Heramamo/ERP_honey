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
              <Route path="/dashboard/rh-paie" element={<PlaceholderPage title="RH & Paie" />} />
              <Route path="/dashboard/finance" element={<PlaceholderPage title="Finance" />} />
              <Route path="/dashboard/mes-heures" element={<PlaceholderPage title="Mes Heures" />} />
              <Route path="/dashboard/feuilles-de-temps" element={<PlaceholderPage title="Feuilles de temps" />} />
              <Route path="/dashboard/paie" element={<PlaceholderPage title="Ma Paie" />} />
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
