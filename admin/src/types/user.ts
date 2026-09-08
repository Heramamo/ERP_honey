export interface User {
    email: string
    role: string
    nom: string
    prenom: string
    id_utilisateur:number
    date_creation:string
}

export interface UserState {
    users:User[];
    loading:boolean;
    error:string | null;
}