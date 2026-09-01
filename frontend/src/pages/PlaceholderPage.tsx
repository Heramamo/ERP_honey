import React from 'react';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full">
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-lg p-12 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-md bg-[var(--accent-soft)] border border-[var(--accent)]/20 flex items-center justify-center mb-4">
          <Construction size={22} className="text-[var(--accent)]" />
        </div>
        <h2 className="text-base font-semibold text-[var(--t1)] mb-1">{title}</h2>
        <p className="text-sm text-[var(--t3)]">Cette section est en cours de construction.</p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
