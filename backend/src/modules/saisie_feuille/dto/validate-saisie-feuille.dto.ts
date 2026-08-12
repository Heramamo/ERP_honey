import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export enum STATUT_FEUILLE {
    VALIDE = 'VALIDE',
    REFUSE = 'REFUSE',
    EN_ATTENTE = 'EN_ATTENTE',
}

export class ValidateSaisieFeuilleDto {
    @ApiProperty({
        enum: STATUT_FEUILLE,
        example: 'VALIDE',
        description: 'Nouveau statut de la feuille (VALIDE ou REFUSE)',
    })
    @IsEnum(STATUT_FEUILLE)
    @IsNotEmpty()
    statut!: STATUT_FEUILLE;
}