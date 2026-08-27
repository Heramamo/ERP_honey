import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateChargeDto
{
    @ApiProperty({example:"Tsy aiko"})
    @IsString()
    @IsNotEmpty()
    libelle!:string

    @ApiProperty({example:2000002})
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    montant!:number

    @ApiProperty({example:"2026-08-24T07:49:26.723Z"})
    @IsDateString()
    date!:string

    @ApiProperty({example:"FIXE"})
    @IsString()
    @IsNotEmpty()
    typeCharge!:string
    @IsNumber()
    idPole!:number
}