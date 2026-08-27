import { Injectable, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from 'src/prisma.service';

import { CreateRevenuDto } from './dto/create-revenu.dto';


@Injectable()
export class RevenuService {
    constructor(private readonly prisma: PrismaService) { }
    async create(dto: CreateRevenuDto) {
        const pole = await this.prisma.pole.findUnique({ where: { id: dto.idPole } })
        if (!pole)
            throw new NotFoundException("Pole qui n existe pas")
        return await this.prisma.revenu.create({data:dto})
    }
    async findAll(){
        return await this.prisma.revenu.findMany()
    } 
}
