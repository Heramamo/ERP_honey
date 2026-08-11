import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateTeacherDto {
  @ApiProperty({
    example: 45.5,
    description: "Taux horaire de base de l'enseignant en Ariary/Heure ou Euros/Heure",
  })
  @IsNumber({}, { message: 'Le taux horaire doit être un nombre.' })
  @IsPositive({ message: 'Le taux horaire doit être supérieur à zéro.' })
  @IsNotEmpty({ message: 'Le taux horaire de base est obligatoire.' })
  tauxHoraireBase!: number;

  @ApiProperty({
    example: 'PERMANENT',
    description: "Statut professionnel de l'enseignant",
  })
  @IsString({ message: 'Le statut doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Le statut est obligatoire.' })
  statut!: string;
}