import type { ValidateSaisieDto } from "../service/saisieFeuille.service";

export interface SaisiePayload
{
    enseignantId:number,
    date:Date,
    heuresEffectuees:number,
    heuresSupp:number,
    typeActivite:string,
    createdAt:Date,
    updatedAt:Date,
    statut:ValidateSaisieDto,
    valideParId:number
}

export interface UserSaisieState{
    saisies:SaisiePayload[],
    error: string | null,
    loading: boolean,
}