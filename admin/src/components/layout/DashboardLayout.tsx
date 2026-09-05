import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('admin_sidebar_collapsed') === 'true'
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      if (next) localStorage.setItem('admin_sidebar_collapsed', 'true');
      else localStorage.removeItem('admin_sidebar_collapsed');
      return next;
    });
  };

  const handleToggleSidebar = () => {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      toggleCollapsed();
    } else {
      setMobileOpen(true);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--app-bg)]">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onToggleCollapsed={toggleCollapsed}
      />
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <Header onToggleSidebar={handleToggleSidebar} />
        <main className="flex-1 min-h-0 overflow-y-auto scroll-thin">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
