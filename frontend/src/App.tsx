import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { DashboardLayout } from './components/layout/DashboardLayout';
import { AdminDashboard } from './pages/AdminDashboard';  
import { TeacherDashboard } from './pages/TeacherDashboard';   

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import { Provider } from 'react-redux';
import { store } from './store';
import ProtectedRoute from './components/ProtectedRoute';
import UnauthorizedPage from './pages/Unauthorizedpage';
import { Layout } from './components/Layout';
import DashboardPage from './pages/DashboardPage';

export const App: React.FC = () => {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
           <Route path='/login' element={<LoginPage/>} />
           <Route path='/register' element={<RegisterPage/>} />
           <Route path="/unauthorized" element={<UnauthorizedPage />} />
           <Route path="/" element={<Navigate to="/dashboard" replace />} />
           <Route element={<ProtectedRoute/>}>
              <Route element={<Layout/>}>
                  <Route path='/dashboard' element={<DashboardPage/>} />
              </Route>
           </Route>
        </Routes>
      
      </BrowserRouter>
    </Provider>
  )
    
};

export default App;