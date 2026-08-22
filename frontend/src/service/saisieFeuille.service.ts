import { api } from "./api";

export interface CreateSaisieDto {
    date: string;
    heuresEffectuees: number;
    heuresSupp: number;
    typeActivite: string;
}

export interface ValidateSaisieDto {
    statut: "VALIDE" | "REFUSE" | "EN_ATTENTE"
}

export const saisieFeuilleService = {
    create: async (data: CreateSaisieDto) => {
        const res = await api.post('/saisie-feuille', data)
        return res.data
    },
    getMySaisie: async () => {
        const res = await api.get('/saisie-feuille/me');
        return res.data;
    },
    getAll: async () => {
        const res = await api.get('/saisie-feuille');
        return res.data;
    },
    getPending: async () => {
        const res = await api.get('/saisie-feuille/pending');
        return res.data;
    },
    validate: async (id: number, statut: ValidateSaisieDto['statut']) => {
        const res = await api.patch(`/saisie-feuille/${id}/valider`, { statut });
        return res.data;
    },

    getMonthSaisie: async (id: number) => {
        const res = await api.get(`/saisie-feuille/${id}/month`);
        return res.data;
    }
}