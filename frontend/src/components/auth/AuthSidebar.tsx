import { Building2 } from 'lucide-react';

export function AuthSidebar() {
  return (
    <div className="md:w-5/12 bg-[#0D182E] p-10 flex flex-col items-center justify-center text-center relative border-r border-slate-800/20">
      <div className="w-20 h-20 bg-[#D4AF37] rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 mb-6">
        <Building2 className="w-10 h-10 text-slate-900" />
      </div>
      <h1 className="text-2xl font-extrabold text-white tracking-wider mb-2">
        HONEY GROUP
      </h1>
      <p className="text-slate-400 text-sm font-medium">Rejoignez l'ERP interne.</p>
    </div>
  );
}