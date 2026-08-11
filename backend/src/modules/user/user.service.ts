import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";

import { PrismaService } from "src/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }
    async createUser(createUserDto: CreateUserDto) {
        const { email, mot_de_passe, nom, prenom, role } = createUserDto
        const userExist = await this.prisma.utilisateur.findUnique(
            {
                where: { email }
            }
        )
        if (userExist)
            throw new ConflictException("Email deja utilise par d'autre utilisateur")
        try {
            const salt = 10
            const hashedPassword = await bcrypt.hash(mot_de_passe, salt);
            const newUser = await this.prisma.utilisateur.create({
                data: {
                    email,
                    mot_de_passe: hashedPassword,
                    nom,
                    prenom,
                    role,
                },
                select: {
                    id_utilisateur: true,
                    email: true,
                    nom: true,
                    prenom: true,
                    role: true,
                    //statut: true,
                    date_creation: true,
                    id_enseignant: true,
                },
            })
            return {
                message: 'Utilisateur créé avec succès',
                data: newUser,
            }
        }
        catch {
            throw new InternalServerErrorException(
                "Une erreur est survenue lors de la création de l'utilisateur.",
            );
        }
    }
}