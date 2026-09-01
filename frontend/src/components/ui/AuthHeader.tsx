interface AuthHeaderProps {
  tag: string;
  title: string;
  subtitle: string;
}

export function AuthHeader({ tag, title, subtitle }: AuthHeaderProps) {
  return (
    <div className="mb-5">
      <span className="text-[10px] font-semibold text-[var(--accent)] uppercase tracking-widest block mb-2">
        {tag}
      </span>
      <h2 className="text-xl font-bold text-[var(--t1)] mb-0.5 leading-tight">
        {title}
      </h2>
      <p className="text-[var(--t3)] text-sm">
        {subtitle}
      </p>
    </div>
  );
}
