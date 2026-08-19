import { useAppSelector } from '../store/hooks';
import AdminDashboard from './AdminDashboard';
import TeacherDashboard from './TeacherDashboard';

const MANAGEMENT_ROLES = ['ADMIN', 'RH', 'FINANCE'];

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);

  if (user?.role === 'ENSEIGNANT') {
    return <TeacherDashboard />;
  }

  if (user && MANAGEMENT_ROLES.includes(user.role)) {
    return <AdminDashboard />;
  }

  return <div>Avertissement : Rôle non reconnu ou session expirée.</div>;
}
