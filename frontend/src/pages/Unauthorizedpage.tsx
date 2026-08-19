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
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40">
          <ShieldAlert className="h-8 w-8 text-red-600 dark:text-red-500" strokeWidth={1.75} />
        </div>

        <p className="text-sm font-medium tracking-wide text-red-600 dark:text-red-500 mb-2">
          Erreur 403
        </p>

        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
          {title}
        </h1>

        <p className="text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleBack}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>

          {onLogin && (
            <button
              onClick={onLogin}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 px-4 py-2.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
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