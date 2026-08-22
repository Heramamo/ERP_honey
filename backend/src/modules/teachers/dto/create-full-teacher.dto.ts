import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { CreateTeacherDto } from './create-teacher.dto';

export class CreateFullTeacherDto extends CreateTeacherDto {
  @ApiProperty({
    example: 'rapytha@gmail.com',
    description: "L'adresse email de l'utilisateur",
  })
  @IsEmail({}, { message: 'Veuillez fournir une adresse email valide' })
  @IsNotEmpty({ message: "L'adresse email est obligatoire" })
  email!: string;

  @ApiProperty({
    example: 'oayLePassword123',
    description: 'Le mot de passe de l’utilisateur (minimum 6 caractères)',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire.' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères.',
  })
  mot_de_passe!: string;

  @ApiProperty({
    example: 'Heriniaina',
    description: "Le nom de famille de l'utilisateur",
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty({ message: 'Le nom est obligatoire.' })
  @MinLength(3, {
    message: 'Le nom doit contenir au moins 3 caractères.',
  })
  nom!: string;

  @ApiProperty({
    example: 'Pytha',
    description: "Le prénom de l'utilisateur",
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty({ message: 'Le prenom est obligatoire.' })
  @MinLength(3, {
    message: 'Le prenom doit contenir au moins 3 caractères.',
  })
  prenom!: string;
}
