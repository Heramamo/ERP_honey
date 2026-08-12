import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateSaisieFeuilleDto } from './dto/create-saisie-feuille.dto';

@Injectable()
export class SaisieFeuilleService {
    constructor(private prisma:PrismaService){}
    async   create(userId:number,createSaisieDto:CreateSaisieFeuilleDto){
        const {date,heuresEffectuees,heuresSupp,typeActivite} = createSaisieDto
        const enseignant = await this.prisma.enseignant.findUnique({where:{id_utilisateur:userId}})
        if (!enseignant)
            throw new NotFoundException("Auccun enseignant avec cet ID")
        return this.prisma.feuilleDeTemps.create({
            data:{
                enseignantId:userId,
                date,
                heuresEffectuees,
                heuresSupp,
                typeActivite
            }
        })
    }
}
