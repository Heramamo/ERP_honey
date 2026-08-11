import { Role } from "src/generated/prisma/enums";
import {isEmail, IsEmail, IsEmpty, IsNotEmpty, IsString, MinLength} from "class-validator"
export class CreateUserDto {
    @IsEmail({}, {message:"Veuillez fournir une addresse email valid"})
    @IsNotEmpty({message:"L'addresse email est obligatoire"})
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'Le mot de passe est obligatoire.' })
    @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' })
    mot_de_passe!: string;

    @IsString()
    @IsNotEmpty({ message: 'Le nom est obligatoire.' })
    @MinLength(3, { message: 'Le nom doit contenir au moins 3 caractères.' })
    nom!: string;

    @IsString()
    @IsNotEmpty({ message: 'Le prenom est obligatoire.' })
    @MinLength(3, { message: 'Le prenom doit contenir au moins 3 caractères.' })
    prenom!: string;

    @IsNotEmpty({ message: 'Le role est obligatoire.' })
    role!: Role;
}