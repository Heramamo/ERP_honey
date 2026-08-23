import type { PaieUtilisateurInfo } from "../service/paie.service";

export interface PaiePayload {
    id: number;
    enseignantId: number;
    totalSalaire: number;
    statutpaie: string;
    date: string;
    mois: string;
    createdAt?: string;
    updatedAt?: string;
    enseignant?: {
        id: number;
        tauxHoraireBase: number;
        utilisateur: PaieUtilisateurInfo;
    };
}

export interface PaieState {
    all: PaiePayload[];
    mine: PaiePayload[];
    loading: boolean;
    error: string | null;
}
