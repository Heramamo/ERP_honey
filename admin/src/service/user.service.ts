import { api } from './api';

export interface CreateUserRequest {
    email: string;
    mot_de_passe: string;
    nom: string;
    prenom: string;
    role: 'ADMIN' | 'RH' | 'FINANCE' | 'ENSEIGNANT';
}

export interface User {
    id_utilisateur: number;
    email: string;
    nom: string;
    prenom: string;
    role: string;
    date_creation: string;
}

export interface CreateUserResponse {
    message: string;
    user: User;
}

export const userService = {
    create: async (data: CreateUserRequest): Promise<CreateUserResponse> => {
        const response = await api.post<CreateUserResponse>('/user/register', data);
        return response.data;
    },

    fetchAll: async (): Promise<User[]> => {
        const response = await api.get<User[]>('/user');
        return response.data;
    }
};
