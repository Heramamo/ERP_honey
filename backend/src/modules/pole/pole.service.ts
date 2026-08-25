import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePoleDto } from './dto/create-pole.dto';

@Injectable()
export class PoleService {
    constructor(private prisma:PrismaService){}
    async create(dto:CreatePoleDto){
        return await this.prisma.pole.create({data:dto})
    }
    async findAll(){
        const poles = await this.prisma.pole.findMany({orderBy:{nom:'asc'}})
        return {
            message:"Liste des poles",
            poles
        }
    }
}
