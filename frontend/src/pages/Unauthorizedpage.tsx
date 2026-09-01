import { ShieldAlert, ArrowLeft, LogIn } from "lucide-react";

interface UnauthorizedPageProps {
  title?: string;
  message?: string;
  onBack?: () => void;
  onLogin?: () => void;
}

export default function UnauthorizedPage({
  title = "Accès refusé",
  message = "Vous n'avez pas les autorisations nécessaires pour accéder à cette page. Si vous pensez qu'il s'agit d'une erreur, contactez un administrateur.",
  onBack,
  onLogin,
}: UnauthorizedPageProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--app-bg)] text-[var(--t1)] px-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--danger-bg)]">
          <ShieldAlert className="h-6 w-6 text-[var(--danger)]" strokeWidth={1.75} />
        </div>

        <p className="text-sm font-medium tracking-wide text-[var(--danger)] mb-2">
          Erreur 403
        </p>

        <h1 className="text-xl font-semibold text-[var(--t1)] mb-3">
          {title}
        </h1>

        <p className="text-[var(--t3)] mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleBack}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-[var(--line-strong)] px-4 py-2 text-sm font-medium text-[var(--t2)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>

          {onLogin && (
            <button
              onClick={onLogin}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[#1a1408] hover:bg-[var(--accent-strong)] transition-colors cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              Se connecter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
