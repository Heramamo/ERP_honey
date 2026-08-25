import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, isNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";


export class CreatePoleDto{
    @ApiProperty({ example: 'Tourisme', description: 'Nom du pole' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    nom!:string

    @ApiProperty({ example: 'Pole tourisme', description: 'Description de la pole' })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description!:string
}