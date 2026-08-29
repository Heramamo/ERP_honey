interface AuthHeaderProps {
  tag: string;
  title: string;
  subtitle: string;
}

export function AuthHeader({ tag, title, subtitle }: AuthHeaderProps) {
  return (
    <div className="mb-6">
      <span className="text-[11px] font-semibold text-[var(--accent)] uppercase tracking-widest block mb-2">
        {tag}
      </span>
      <h2 className="text-2xl font-extrabold text-[var(--t1)] mb-1 leading-tight">
        {title}
      </h2>
      <p className="text-[var(--t2)] text-sm leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}
