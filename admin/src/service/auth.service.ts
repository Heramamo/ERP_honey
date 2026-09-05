import { api } from './api';

export interface LoginRequest {
    email: string;
    mot_de_passe: string;
}

export interface LoginResponse {
    access_token: string;
    user: {
        id: number;
        email: string;
    };
}

export const authService = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/user/login', data);
        return response.data;
    }
};
