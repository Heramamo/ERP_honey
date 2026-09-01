import {
  PieChart,
  Wallet,
  Clock,
  Check,
} from 'lucide-react';

const HIGHLIGHTS = [
  { icon: PieChart, label: 'Pilotage financier', desc: 'Trésorerie, charges et pôles en un coup d’œil' },
  { icon: Wallet, label: 'Paie & RH', desc: 'Fiches de paie et statuts des enseignants' },
  { icon: Clock, label: 'Suivi des heures', desc: 'Déclaration et validation des feuilles de temps' },
];

export function AuthSidebar() {
  return (
    <aside className="md:w-5/12 bg-[var(--panel-deep)] border-r border-[var(--line)] p-8 md:p-10 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-[var(--accent)] flex items-center justify-center text-[#1a1408] font-semibold text-lg shrink-0">
            H
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-[var(--t1)] tracking-tight">Honey Group</p>
            <p className="text-[11px] text-[var(--t3)] font-medium">ERP interne</p>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-[11px] font-semibold text-[var(--accent)] uppercase tracking-widest mb-3">
            Pourquoi Honey ERP
          </p>
          <h2 className="text-xl md:text-2xl font-semibold text-[var(--t1)] leading-snug tracking-tight">
            Vos opérations, regroupées dans un seul espace de travail.
          </h2>
        </div>

        <ul className="mt-8 space-y-5">
          {HIGHLIGHTS.map(({ icon: Icon, label, desc }) => (
            <li key={label} className="flex items-start gap-3">
              <span className="w-8 h-8 shrink-0 rounded-md border border-[var(--line-strong)] bg-[var(--panel)] flex items-center justify-center text-[var(--accent)]">
                <Icon size={16} strokeWidth={2} />
              </span>
              <div className="leading-tight">
                <p className="text-[13px] font-semibold text-[var(--t1)]">{label}</p>
                <p className="text-xs text-[var(--t3)] mt-0.5">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 pt-5 border-t border-[var(--line)] flex items-center gap-2 text-xs text-[var(--t3)]">
        <Check size={14} className="text-[var(--accent)] shrink-0" />
        <span>Accès sécurisé réservé au réseau d’entreprise</span>
      </div>
    </aside>
  );
}
