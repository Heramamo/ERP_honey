import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { CreateFullTeacherDto } from './dto/create-full-teacher.dto';
import { Role } from 'src/generated/prisma/enums';
import * as bcrypt from 'bcrypt';


@Injectable()
export class TeachersService {
    constructor(private prisma: PrismaService) { }
    async createWithProfile(dto: CreateFullTeacherDto) {
        const { email, mot_de_passe, nom, prenom, tauxHoraireBase, statut } = dto
        const userExist = await this.prisma.utilisateur.findUnique({ where: { email } })
        if (userExist)
            throw new ConflictException("Email deja utilise par d'autre utilisateur")
        const salt = 10
        const hashedPassword = await bcrypt.hash(mot_de_passe, salt)
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.utilisateur.create({
                data: {
                    email,
                    mot_de_passe: hashedPassword,
                    nom,
                    prenom,
                    role: Role.ENSEIGNANT,
                },
                select: {
                    id_utilisateur: true,
                    email: true,
                    nom: true,
                    prenom: true,
                    role: true,
                },
            })
            return tx.enseignant.create({
                data: {
                    tauxHoraireBase,
                    statut,
                    id_utilisateur: user.id_utilisateur
                },
                include: {
                    utilisateur: {
                        select: {
                            id_utilisateur: true,
                            nom: true,
                            prenom: true,
                            email: true,
                            role: true,
                        }
                    }
                }
            })
        })
    }
    async createProfile(userId: number, teacherDto: CreateTeacherDto) {
        const { statut, tauxHoraireBase } = teacherDto
        const user = await this.prisma.utilisateur.findUnique({ where: { id_utilisateur: userId }, include: { enseignant: true } })
        if (!user)
            throw new NotFoundException("Utilisateur n'existe pas")
        if (user.enseignant)
            throw new ConflictException('Un profil enseignant existe déjà pour cet utilisateur.');
        return await this.prisma.enseignant.create({
            data: {
                tauxHoraireBase,
                statut,
                id_utilisateur: userId
            },
            include: {
                utilisateur: {
                    select: {
                        id_utilisateur: true,
                        nom: true,
                        prenom: true,
                        email: true,
                        role: true,
                    }
                }
            }
        })
    }
    async getProfile(userId: number) {
        const enseignant = await this.prisma.enseignant.findUnique({ where: { id_utilisateur: userId } })
        if (!enseignant)
            throw new NotFoundException("Aucun profil enseignant trouvé pour cet utilisateur")
        return enseignant
    }
    async getAll() {
        return this.prisma.enseignant.findMany({
            include: {
                utilisateur: {
                    select: {
                        id_utilisateur: true,
                        nom: true,
                        prenom: true,
                        email: true,
                        role: true,
                    }
                }
            }
        })
    }
}
