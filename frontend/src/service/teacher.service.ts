import { api } from "./api";

export interface CreateTeacherDto {
    nom: string;
    prenom: string;
    email: string;
    mot_de_passe: string;
    tauxHoraireBase: number;
    statut: string;
}

export const teacherService = {
    getMyProfile: async () => {
        const res = await api.get('/teachers/profile');
        return res.data;
    },
    getAll: async () => {
        const res = await api.get('/teachers');
        return res.data;
    },
    createTeacher: async (dto: CreateTeacherDto) => {
        const res = await api.post('/teachers', dto);
        return res.data;
    }
}
