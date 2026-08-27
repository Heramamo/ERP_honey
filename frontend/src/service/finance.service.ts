import { api } from "./api";

export interface Pole {
    id: number;
    nom: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Revenu {
    id: number;
    libelle: string;
    montant: number;
    date: string;
    typeRevenu: string;
    idPole: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Charge {
    id: number;
    libelle: string;
    montant: number;
    date: string;
    typeCharge: string;
    idPole: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface BilanPole {
    idPole: number;
    nomPole: string;
    totalChargesFixe: number;
    totalChargeVariable: number;
    totalRevenu: number;
    totalCharge: number;
    beneficeNet: number;
}

export interface CreatePoleDto {
    nom: string;
    description?: string;
}

export interface CreateRevenuDto {
    libelle: string;
    montant: number;
    date: string;
    typeRevenu: string;
    idPole: number;
}

export interface CreateChargeDto {
    libelle: string;
    montant: number;
    date: string;
    typeCharge: string;
    idPole: number;
}

export interface PolesResponse {
    message: string;
    poles: Pole[];
}

export const financeService = {
    // Poles
    getPoles: async (): Promise<PolesResponse> => {
        const res = await api.get('/pole');
        return res.data;
    },
    createPole: async (dto: CreatePoleDto): Promise<Pole> => {
        const res = await api.post('/pole', dto);
        return res.data;
    },

    // Revenus
    createRevenu: async (dto: CreateRevenuDto): Promise<Revenu> => {
        const res = await api.post('/revenu', dto);
        return res.data;
    },
    getRevenus: async (): Promise<Revenu[]> => {
        const res = await api.get('/revenu');
        return res.data;
    },

    // Charges
    createCharge: async (dto: CreateChargeDto): Promise<Charge> => {
        const res = await api.post('/charge', dto);
        return res.data;
    },
    getCharges: async (): Promise<Charge[]> => {
        const res = await api.get('/charge');
        return res.data;
    },
    getChargeById: async (id: number): Promise<Charge> => {
        const res = await api.get(`/charge/${id}`);
        return res.data;
    },

    // Bilans
    getBilanPole: async (idPole: number, mois: string): Promise<BilanPole> => {
        const res = await api.get(`/bilan/pole/${idPole}`, { params: { mois } });
        return res.data;
    },
};
