import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateChargeDto } from './dto/create-charge.dto';

@Injectable()
export class ChargeService {
    constructor(private readonly prisma:PrismaService){}
    async create(dto:CreateChargeDto){
        const pole = await this.prisma.pole.findUnique({where:{id:dto.idPole}})
        if (!pole)
            throw new NotFoundException("Pole qui n existe pas")
        return await this.prisma.charge.create({data:dto})
    }
    async findAll(){
        return await this.prisma.charge.findMany()
    } 
    async findById(id:number)
    {
        const pole = await this.prisma.charge.findUnique({where:{id}})
        if (!pole)
            throw new NotFoundException("Pole qui n existe pas")
        return pole
    }
}
