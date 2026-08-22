import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SaisieFeuilleService } from '../saisie_feuille/saisie_feuille.service';
import { GeneratePaieDto } from './dto/paie.dto';

@Injectable()
export class PaieService {
    constructor(private prisma:PrismaService, private saisieFeuille: SaisieFeuilleService){}
    async   generateMonthlyPayroll(dto:GeneratePaieDto){
        const {userId, month, year} = dto
        const enseignant = await this.prisma.enseignant.findUnique({where:{id_utilisateur:userId}})
        if (!enseignant) 
            throw new NotFoundException("Aucun enseignant trouvé pour cet utilisateur");
        const moisFormat = `${year}-${String(month).padStart(2, '0')}`;
        const existingPaie = await this.prisma.paie.findFirst({
            where:{
                enseignantId:enseignant.id,
                mois:moisFormat
            }
        })
        if (existingPaie)
            throw new ConflictException(`La fiche de paie pour la periode ${moisFormat} existe deja`)
        const totalSalaire = await this.saisieFeuille.calculMonthSalary(userId, month, year)
        return this.prisma.paie.create({
            data: {
                enseignantId: enseignant.id,
                totalSalaire,
                statutpaie: "EN_ATTENTE",
                mois: moisFormat,
                date: new Date()
            }
        });
    }
}
