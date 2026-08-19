import React from 'react';
import { Activity, Code2, RotateCw } from 'lucide-react';
import { Card } from '../../ui/Card';

export const LastEntryCard: React.FC = () => {
  return (
    <Card className="justify-between">
      <div>
        <div className="flex items-center gap-2 text-amber-500 mb-6">
          <Activity size={18} />
          <h3 className="text-sm font-bold text-white">Dernière Saisie Enregistrée</h3>
        </div>

        <h2 className="text-3xl font-black text-white tracking-tight">12 Août 2026</h2>

        {/* Badges de détails */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="bg-slate-900 border border-slate-700/80 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg">
            5,5 h total <span className="text-slate-400 text-[11px]">(4h Base + 1,5h Supp)</span>
          </span>

          <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Code2 size={14} />
            Cours (React JS)
          </span>

          <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
            ● Validé
          </span>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-[11px] text-slate-400 font-medium">
        <RotateCw size={12} className="text-slate-500" />
        <span>Dernière mise à jour transmise aux RH</span>
      </div>
    </Card>
  );
};
