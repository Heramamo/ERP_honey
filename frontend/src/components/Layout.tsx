import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

export const Layout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="brand">HONEY ERP</div>
        
        <nav className="nav-links">
          <Link to="/dashboard">Tableau de bord</Link>

          {user?.role === 'ENSEIGNANT' && (
            <Link to="/feuilles-de-temps">Mes Heures</Link>
          )}

        
          {['ADMIN', 'RH'].includes(user?.role || '') && (
            <Link to="/validation-feuilles">Validation Feuilles</Link>
          )}

          {['ADMIN', 'RH', 'FINANCE'].includes(user?.role || '') && (
            <Link to="/paie">Gestion Paie</Link>
          )}

          {['ADMIN', 'FINANCE'].includes(user?.role || '') && (
            <Link to="/finance-poles">Finances & Pôles</Link>
          )}
        </nav>

        <div className="user-profile">
          <span>{user?.email} (<strong>{user?.role}</strong>)</span>
          <button onClick={handleLogout} className="btn-logout">Déconnexion</button>
        </div>
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};