interface AuthHeaderProps {
  tag: string;
  title: string;
  subtitle: string;
}

export function AuthHeader({ tag, title, subtitle }: AuthHeaderProps) {
  return (
    <div className="mb-6">
      <span className="text-xs font-extrabold text-[#D4AF37] tracking-widest uppercase block mb-1">
        {tag}
      </span>
      <h2 className="text-2xl font-extrabold text-slate-900 mb-1 leading-tight">
        {title}
      </h2>
      <p className="text-slate-600 text-sm font-medium leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}