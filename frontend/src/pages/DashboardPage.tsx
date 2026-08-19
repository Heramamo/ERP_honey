import React from 'react';
import { useAppSelector } from '../store/hooks';
import AdminDashboard from './AdminDashboard';
import TeacherDashboard from './TeacherDashboard';


export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);

  switch (user?.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'RH':
      return <AdminDashboard />;
    case 'ENSEIGNANT':
      return <TeacherDashboard />;
    default:
      return <div>Avertissement : Rôle non reconnu ou session expirée.</div>;
  }
}