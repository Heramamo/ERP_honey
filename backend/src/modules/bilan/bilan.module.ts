import { Module } from '@nestjs/common';
import { BilanService } from './bilan.service';
import { BilanController } from './bilan.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [BilanController],
  providers: [BilanService, PrismaService],
})
export class BilanModule {}
