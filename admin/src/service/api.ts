import axios from "axios";
import { Urls } from "../const/url";

export const api = axios.create({
    baseURL: Urls.baseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token')
    if (token)
        config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use((response) => response, (error) => {
    const url: string = error.config?.url ?? ''
    const isAuthRoute = url.includes('/user/login')
    if (error.response && error.response.status == 401 && !isAuthRoute) {
        localStorage.removeItem('admin_token')
        window.location.href = '/login'
    }
    return Promise.reject(error)
})
