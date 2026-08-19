import React from 'react';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full">
      <div className="bg-[#111726] border border-slate-800/90 rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[60vh] shadow-lg">
        <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
          <Construction size={28} className="text-amber-400" />
        </div>
        <h2 className="text-lg font-bold text-white mb-1">{title}</h2>
        <p className="text-xs text-slate-400 font-medium">Cette section est en cours de construction.</p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
