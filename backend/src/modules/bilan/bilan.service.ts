import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { getBornesMois } from 'src/shared/data-utils';
import { prismaToNumber } from 'src/shared/utils';
export interface   BilanPole {
    idPole:number
    nomPole:string
    totalChargesFixe:number
    totalChargeVariable:number
    totalRevenu:number
    totalCharge:number
    beneficeNet:number
}
@Injectable()
export class BilanService {
    constructor(private readonly prisma:PrismaService){}
    async getBilanPole(idPole:number, mois:string):Promise<BilanPole>{
        const pole = await this.prisma.pole.findUnique({where:{id:idPole}})
        if (!pole)
            throw new NotFoundException("Auccun pole avec cet id")
        const {debut, fin} = getBornesMois(mois)
        const [revenus, chargeFixes, chargeVariable] = await Promise.all([
            this.prisma.revenu.aggregate({
                _sum:{montant:true},
                where:{idPole:idPole, date:{gte:debut, lt:fin}}
            }),
            this.prisma.charge.aggregate({
                _sum:{montant:true},
                where:{idPole:idPole, typeCharge:"FIXE", date:{gte:debut, lt:fin}}
            }),
             this.prisma.charge.aggregate({
                _sum:{montant:true},
                where:{idPole:idPole, typeCharge:"VARIABLE", date:{gte:debut, lt:fin}}
            })
        ])
        console.log(revenus)
        const totalRevenu = prismaToNumber(revenus._sum.montant)
        const totalChargeFixe = prismaToNumber(chargeFixes._sum.montant)
        const totalChargeVariable = prismaToNumber(chargeVariable._sum.montant)
        const  totalCharge=totalChargeFixe + totalChargeVariable
        return{
            idPole,
            nomPole:pole.nom,
            totalChargesFixe:totalChargeFixe,
            totalChargeVariable:totalChargeVariable,
            totalCharge:totalCharge,
            totalRevenu:totalRevenu,
            beneficeNet:totalRevenu - totalCharge
        }
    }
}
