import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";

import { PrismaService } from "src/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from "./dto/login-user.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { NotFoundException } from "@nestjs/common";
@Injectable()
export class UserService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }
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

                    date_creation: true,
                    
                },
            })
            return {
                message: 'Compte créé avec succès',
                user: newUser,
            }   
        }
        catch {
            throw new InternalServerErrorException(
                "Une erreur est survenue lors de la création de l'utilisateur.",
            );
        }
    }
    async loginUser(loginDto: LoginUserDto) {
        const { email, mot_de_passe } = loginDto
        const user = await this.prisma.utilisateur.findUnique({ where: { email } })
        if (!user)
            throw new UnauthorizedException("Identifiant non valide")
        const isPassword = await bcrypt.compare(mot_de_passe, user.mot_de_passe)
        if (!isPassword) {
            throw new UnauthorizedException('Identifiants invalides');
        }
        const payload = { sub: user.id_utilisateur, email: user.email, role: user.role,nom:user.nom };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id_utilisateur,
                email: user.email,

            },
        };
    }
    async changePassword(userId: number, dto: ChangePasswordDto) {
        const user = await this.prisma.utilisateur.findUnique({ where: { id_utilisateur: userId } })
        if (!user)
            throw new NotFoundException("Utilisateur introuvable")
        const isCurrentValid = await bcrypt.compare(dto.mot_de_passe_actuel, user.mot_de_passe)
        if (!isCurrentValid)
            throw new UnauthorizedException("Le mot de passe actuel est incorrect")
        const salt = 10
        const hashedPassword = await bcrypt.hash(dto.nouveau_mot_de_passe, salt)
        await this.prisma.utilisateur.update({
            where: { id_utilisateur: userId },
            data: { mot_de_passe: hashedPassword },
        })
        return { message: 'Mot de passe modifié avec succès' }
    }
}
