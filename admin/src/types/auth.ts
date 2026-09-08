export type Role = 'ADMIN' | 'RH' | 'FINANCE' | 'ENSEIGNANT';

export interface UserPayload {
  sub: number;       
  email: string;
  role: Role;
  exp: number;       
}

export interface AuthState {
  token: string | null;
  user: UserPayload | null;
  isAuthenticated: boolean;
}

export interface  UserType
{
  email:string
  role:string
  nom:string
  prenom:string
}