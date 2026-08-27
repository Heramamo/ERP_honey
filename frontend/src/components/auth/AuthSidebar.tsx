export function AuthSidebar() {
  return (
    <div className="lg:w-5/12 bg-[var(--panel-deep)] comb-paper p-10 flex flex-col items-center justify-center text-center relative border-r border-[var(--border-subtle)]">
      <div className="hex-chip w-20 h-20 text-3xl mb-6 shadow-[0_16px_40px_-16px_var(--honey)]">
        <span className="font-display font-black leading-none">H</span>
      </div>
      <h1 className="font-display text-2xl font-bold text-[var(--t1)] tracking-tight uppercase mb-2">
        HONEY GROUP
      </h1>
      <p className="font-mono text-[10px] font-semibold text-[var(--t3)] tracking-[0.2em] uppercase mb-6">
        ERP INTERNE
      </p>
      <p className="text-sm text-[var(--t3)] font-medium">Rejoignez l'ERP interne.</p>
    </div>
  );
}