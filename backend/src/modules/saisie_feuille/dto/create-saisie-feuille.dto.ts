import { IsNotEmpty, IsNumber, IsString, IsDateString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'
import { IsNotFutureDate } from 'src/shared/validators/is-not-future-date.decorator';
export class CreateSaisieFeuilleDto {
    @ApiProperty({ example: '2026-08-12T08:00:00.000Z', description: 'Date de la prestation' })
    @IsDateString()
    @IsNotEmpty()
    @IsNotFutureDate({ message: 'La date ne peut pas être dans le futur' })
    date!: string;

    @ApiProperty({ example: 4.5, description: 'Heures normales effectuées' })
    @IsNumber()
    heuresEffectuees!: number;

    @ApiProperty({ example: 1.5, description: 'Heures supplémentaires' })
    @IsNumber()
    heuresSupp!: number;

    @ApiProperty({ example: 'Cours', description: 'Type d\'activité (ex: Cours, Préparation)' })
    @IsString()
    @IsNotEmpty()
    typeActivite!: string;
}