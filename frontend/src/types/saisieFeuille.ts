import type { ValidateSaisieDto } from "../service/saisieFeuille.service";

export interface SaisieEnseignantInfo {
    id: number;
    tauxHoraireBase?: number;
    statut?: string;
    utilisateur: {
        id_utilisateur: number;
        nom: string;
        prenom: string;
        email: string;
    };
}

export interface SaisiePayload
{
    id?: number,
    enseignantId:number,
    date:Date,
    heuresEffectuees:number,
    heuresSupp:number,
    typeActivite:string,
    createdAt:Date,
    updatedAt:Date,
    statut:string | ValidateSaisieDto["statut"],
    valideParId:number | null,
    enseignant?: SaisieEnseignantInfo,
}

export interface UserSaisieState{
    saisies:SaisiePayload[],
    all:SaisiePayload[],
    pending:SaisiePayload[],
    error: string | null,
    loading: boolean,
}
