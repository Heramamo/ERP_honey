export interface EnseignantProfile {
    id: number;
    tauxHoraireBase: number;
    statut: string;
    createdAt: Date;
    updatedAt: Date;
    id_utilisateur: number;
}

export interface EnseignantState {
    enseignant: EnseignantProfile | null;
    loading: boolean;
    error: string | null;
}

export interface EnseignantPayload {
    id: number;
    tauxHoraireBase: number;
    statut: string;
    createdAt: Date;
    updatedAt: Date;
    id_utilisateur: number;
    utilisateur: {
        id_utilisateur: number;
        nom: string;
        prenom: string;
        email: string;
        role: string;
    };
}

export interface EnseignantListState {
    enseignants: EnseignantPayload[];
    loading: boolean;
    error: string | null;
}
