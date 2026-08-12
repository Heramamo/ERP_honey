import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";

import { PrismaService } from "src/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from "./dto/login-user.dto";
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
            const payload = { sub: newUser.id_utilisateur, email: newUser.email, role: newUser.role };
            const token = await this.jwtService.signAsync(payload);

            return {
                message: 'Compte créé avec succès',
                access_token: token,
                user: newUser,
                requiresTeacherProfile: newUser.role === 'ENSEIGNANT', 
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
        const payload = { sub: user.id_utilisateur, email: user.email, role: user.role };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id_utilisateur,
                email: user.email,

            },
        };
    }
}
