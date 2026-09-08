import { api } from "./api";
import { financeService } from "./finance.service";
import type { Charge } from "./finance.service";
export interface PaieUtilisateurInfo {
    id_utilisateur: number;
    nom: string;
    prenom: string;
    email: string;
    role: string;
}

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

export interface GeneratePaieDto {
    userId: number;
    month: number;
    year: number;
}

export const paieService = {
    getMine: async () => {
        const res = await api.get('/paie/me');
        return res.data;
    },
    getAll: async (mois?: string) => {
        const res = await api.get('/paie/all', { params: mois ? { mois } : {} });
        return res.data;
    },
    generate: async (data: GeneratePaieDto) => {
        const res = await api.post('/paie/generer', data);
        return res.data;
    },
    updateStatus: async (id: number, statutpaie: string, paie?: Pick<PaiePayload, 'totalSalaire' | 'date'>): Promise<{ paie: PaiePayload; charge?: Charge }> => {
        const res = await api.patch(`/paie/${id}/statut`, { statutpaie });
        let charge: Charge | undefined;
        if (statutpaie === 'PAYE' && paie) {
            try {
                const pole = await financeService.getPoleByName("ENSEIGNANT");
                charge = await financeService.createCharge({
                    idPole: pole.id,
                    libelle: "Paiement salaire",
                    montant: paie.totalSalaire,
                    typeCharge: "FIXE",
                    date: paie.date,
                });
            } catch (error) {
                console.error("Erreur lors de la création de la charge:", error);
            }
        }
        return { paie: res.data, charge };
    },
}
