interface AuthHeaderProps {
  tag: string;
  title: string;
  subtitle: string;
}

export function AuthHeader({ tag, title, subtitle }: AuthHeaderProps) {
  return (
    <div className="mb-6">
      <span className="font-mono text-[10px] font-semibold text-[var(--honey)] tracking-[0.22em] uppercase block mb-2">
        {tag}
      </span>
      <h2 className="font-display text-[1.6rem] font-bold text-[var(--t1)] mb-1 leading-tight tracking-tight">
        {title}
      </h2>
      <p className="text-sm text-[var(--t3)] font-medium leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}