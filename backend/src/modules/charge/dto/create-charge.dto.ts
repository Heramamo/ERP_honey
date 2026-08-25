import { IsDateString, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateChargeDto
{
    @IsString()
    @IsNotEmpty()
    libelle!:string

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    montant!:number

    @IsDateString()
    date!:string

    @IsString()
    @IsNotEmpty()
    typeCharge!:string
    @IsNumber()
    idPole!:number
}