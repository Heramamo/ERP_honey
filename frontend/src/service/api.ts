import axios from "axios";
import { Urls } from "../const/url";



export const api = axios.create({
    baseURL:Urls.baseUrl,
    headers:{
        'Content-Type':'application/json'
    }
})

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('access_token')
    if (token)
        config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use((response)=>response,(error)=>{
    const url: string = error.config?.url ?? ''
    const isAuthRoute = url.includes('/user/login') || url.includes('/user/register')
    if (error.response && error.response.status == 401 && !isAuthRoute){
        localStorage.removeItem('access_token')
        window.location.href = '/login?expired=true';
    }
    return Promise.reject(error)
})