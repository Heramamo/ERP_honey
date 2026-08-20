import { api } from "./api";

export const teacherService = {
    getMyProfile: async () => {
        const res = await api.get('/teachers/profile');
        return res.data;
    }
}
