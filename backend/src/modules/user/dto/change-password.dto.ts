import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: "Le mot de passe actuel de l'utilisateur",
  })
  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe actuel est obligatoire.' })
  mot_de_passe_actuel!: string;

  @ApiProperty({
    description: 'Le nouveau mot de passe (minimum 6 caractères)',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: 'Le nouveau mot de passe est obligatoire.' })
  @MinLength(6, {
    message: 'Le nouveau mot de passe doit contenir au moins 6 caractères.',
  })
  nouveau_mot_de_passe!: string;
}
