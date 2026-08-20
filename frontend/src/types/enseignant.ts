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
