import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Boxes, ArrowRight } from 'lucide-react';

interface PoleNotFoundProps {
  poleName?: string;
}

const PoleNotFound: React.FC<PoleNotFoundProps> = ({ poleName = 'ENSEIGNANT' }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full p-6 md:p-8 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--warning-bg)] border border-[var(--warning-line)]">
          <Boxes className="h-6 w-6 text-[var(--warning)]" strokeWidth={1.75} />
        </div>

        <p className="text-xs font-semibold tracking-wide uppercase text-[var(--warning)] mb-2">
          Pôle manquant
        </p>

        <h2 className="text-lg font-semibold text-[var(--t1)] mb-2">
          Le pôle « {poleName} » n'existe pas encore
        </h2>

        <p className="text-sm text-[var(--t3)] mb-8 leading-relaxed">
          Cette section nécessite le pôle « {poleName} ». Créez-le dans la gestion
          des pôles pour accéder aux enseignants.
        </p>

        <button
          onClick={() => navigate('/dashboard/poles')}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#1a1408] hover:bg-[var(--accent-strong)] transition-colors cursor-pointer"
        >
          <Boxes className="h-4 w-4" />
          Aller aux pôles
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PoleNotFound;