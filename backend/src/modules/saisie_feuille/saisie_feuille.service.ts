import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateSaisieFeuilleDto } from './dto/create-saisie-feuille.dto';
import { ValidateSaisieFeuilleDto } from './dto/validate-saisie-feuille.dto';
import { DateUtils } from 'src/shared/data-utils';

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
                enseignantId:enseignant.id,
                date,
                heuresEffectuees,
                heuresSupp,
                typeActivite
            }
        })
    }
    async   validate(id:number, validatorUserId:number, dto:ValidateSaisieFeuilleDto){
        const feuille = await this.prisma.feuilleDeTemps.findUnique({where:{id}})
        if (!feuille)
            throw new NotFoundException("Auccun feuille de temps avec cet ID")
        if (dto.statut == "EN_ATTENTE")
            throw new BadRequestException("VALIDE ou REFUSE")
        return this.prisma.feuilleDeTemps.update({
            where:{id},
            data:{
                statut:dto.statut,
                valideParId:validatorUserId
            }
        })
    }
    async   getAllSaisie(){
        return await this.prisma.feuilleDeTemps.findMany()
    }
    async   getMySaisie(userId:number){
        return await this.prisma.feuilleDeTemps.findMany({where:{enseignantId:userId}})
    }
    async   getPendingSaisie(){
        return await this.prisma.feuilleDeTemps.findMany({where:{statut:"EN_ATTENTE"}})
    }
    async   getMyPendingSaisie(userId:number)
    {
        return  await this.prisma.feuilleDeTemps.findMany({where:{
            enseignantId:userId,
            statut:"EN_ATTENTE"
        }})
    }
    async calculMonthSalary(userId: number, month?: number, year?: number) {
        const enseignant = await this.prisma.enseignant.findUnique({
            where: { id_utilisateur: userId }
        });
        if (!enseignant) throw new NotFoundException("Aucun enseignant trouvé pour cet utilisateur");

        const targetMonth = month ?? new Date().getMonth() + 1;
        const targetYear = year ?? new Date().getFullYear();

        const startOfMonth = new Date(targetYear, targetMonth - 1, 1);
        const endOfMonth = new Date(targetYear, targetMonth, 0, 23, 59, 59);

        const feuillesValidees = await this.prisma.feuilleDeTemps.findMany({
            where: {
                enseignantId: enseignant.id,
                statut: "VALIDE",
                date: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            }
        });

        const totalHeures = feuillesValidees.reduce((acc, curr) => acc + curr.heuresEffectuees, 0);
        const totalHeuresSupp = feuillesValidees.reduce((acc, curr) => acc + curr.heuresSupp, 0);

        const COEFF_HEURES_SUPP = 1.25;
        const salaireHeuresNormales = totalHeures * enseignant.tauxHoraireBase;
        const salaireHeuresSupp = totalHeuresSupp * enseignant.tauxHoraireBase * COEFF_HEURES_SUPP;

        return salaireHeuresNormales + salaireHeuresSupp;
    }
}
