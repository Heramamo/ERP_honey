import type { AxiosError } from 'axios';

export function getApiErrorMessage(error: unknown, fallback = 'Une erreur est survenue'): string {
    const axiosError = error as AxiosError<{ message?: string | string[] }>;
    const data = axiosError?.response?.data as { message?: string | string[] } | undefined;
    if (data?.message) {
        return Array.isArray(data.message) ? data.message.join(' - ') : data.message;
    }
    if (axiosError?.message) {
        return axiosError.message;
    }
    return fallback;
}
