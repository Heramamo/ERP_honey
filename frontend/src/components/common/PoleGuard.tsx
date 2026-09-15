import React, { useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import { Loader2, TriangleAlert, RefreshCw } from 'lucide-react';
import { financeService } from '../../service/finance.service';
import PoleNotFound from './PoleNotFound';

type PoleStatus = 'checking' | 'exists' | 'missing' | 'error';

interface PoleGuardProps {
  poleName?: string;
  children: React.ReactNode;
}

const PoleGuard: React.FC<PoleGuardProps> = ({ poleName = 'ENSEIGNANT', children }) => {
  const [status, setStatus] = useState<PoleStatus>('checking');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;

    financeService
      .getPoleByName(poleName)
      .then(() => {
        if (active) setStatus('exists');
      })
      .catch((error: unknown) => {
        if (!active) return;
        const axiosError = error as AxiosError;
        setStatus(axiosError.response?.status === 404 ? 'missing' : 'error');
      });

    return () => {
      active = false;
    };
  }, [poleName, retryKey]);

  if (status === 'checking') {
    return (
      <div className="w-full h-full p-6 md:p-8 flex items-center justify-center">
        <div className="flex items-center gap-2.5 text-[var(--t3)]">
          <Loader2 className="w-5 h-5 animate-spin text-[var(--accent)]" />
          <span className="text-sm">Vérification du pôle « {poleName} »...</span>
        </div>
      </div>
    );
  }

  if (status === 'missing') {
    return <PoleNotFound poleName={poleName} />;
  }

  if (status === 'error') {
    return (
      <div className="w-full h-full p-6 md:p-8 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--danger-bg)] border border-[var(--danger-line)]">
            <TriangleAlert className="h-6 w-6 text-[var(--danger)]" strokeWidth={1.75} />
          </div>

          <h2 className="text-lg font-semibold text-[var(--t1)] mb-2">
            Impossible de vérifier le pôle
          </h2>

          <p className="text-sm text-[var(--t3)] mb-8 leading-relaxed">
            Une erreur est survenue lors de la vérification du pôle « {poleName} ».
            Réessayez pour afficher la section.
          </p>

          <button
            onClick={() => {
              setStatus('checking');
              setRetryKey((k) => k + 1);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-[var(--line-strong)] px-4 py-2 text-sm font-medium text-[var(--t2)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PoleGuard;