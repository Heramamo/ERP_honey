import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="h-16 flex items-center px-4 border-b border-[var(--line)] bg-[var(--panel)]">
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg text-[var(--t2)] hover:bg-[var(--surface-hover)] hover:text-[var(--t1)] transition-colors"
      >
        <Menu size={20} />
      </button>
      <div className="ml-4">
        <h1 className="text-lg font-semibold text-[var(--t1)]">Administration</h1>
      </div>
    </header>
  );
};

export default Header;
