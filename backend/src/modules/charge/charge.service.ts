import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChargeService {
    constructor(private readonly prisma:PrismaService){}
    
}
