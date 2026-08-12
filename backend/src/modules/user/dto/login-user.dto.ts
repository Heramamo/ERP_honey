import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {
    @ApiProperty({ example: "rapytha@gmail.com" })
    @IsEmail({}, { message: "Entrer une addresse email valide" })
    @IsNotEmpty({ message: "L'addresse est email est requis" })
    email!: string

    @ApiProperty({
        example: 'PassLeWordLtyEh',
        description: "Le mot de passe de l'utilisateur",
    })
    @IsString()
    @IsNotEmpty({ message: 'Le mot de passe est requis' })
    mot_de_passe!: string;
}