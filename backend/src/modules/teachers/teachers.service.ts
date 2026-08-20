import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';


@Injectable()
export class TeachersService {
    constructor(private prisma: PrismaService) { }
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
