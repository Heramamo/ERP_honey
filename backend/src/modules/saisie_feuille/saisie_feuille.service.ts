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
                enseignantId:userId,
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
    async   calculMonthSalary(userId:number){
        const curr_month = new Date().getMonth() + 1;
        const enseignant = await this.prisma.enseignant.findUnique({where:{id:userId}})
        if (!enseignant)
            throw new NotFoundException("Auccun enseignant avec cet ID")
        const calcul = await this.prisma.feuilleDeTemps.findMany({where:{enseignantId:userId}})
        const monthFuille = calcul.filter(e=> {return(DateUtils.getMonth(e.date) == curr_month)})
        const totalHeure = monthFuille.reduce((acc, curr)=> acc + curr.heuresEffectuees, 0)
        const totalHeureSupp = monthFuille.reduce((acc, curr)=>acc + curr.heuresSupp,0)
        return ((totalHeure * enseignant.tauxHoraireBase + (totalHeureSupp * enseignant.tauxHoraireBase)))
    }
}
