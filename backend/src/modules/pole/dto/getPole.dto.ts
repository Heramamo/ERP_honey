import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MaxLength } from "class-validator"

export class GetPoleByNameDto {
    @ApiProperty({ example: 'TOURISME', description: 'Nom du pole' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    nom!: string
    
}