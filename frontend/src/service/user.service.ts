import { api } from "./api";

export interface ChangePasswordDto {
    mot_de_passe_actuel: string;
    nouveau_mot_de_passe: string;
}

export const userService = {
    changePassword: async (data: ChangePasswordDto) => {
        const res = await api.post('/user/change-password', data);
        return res.data;
    },
}
