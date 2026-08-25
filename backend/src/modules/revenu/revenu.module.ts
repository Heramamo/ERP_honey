import { Module } from '@nestjs/common';
import { RevenuService } from './revenu.service';
import { RevenuController } from './revenu.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [RevenuController],
  providers: [RevenuService, PrismaService],
})
export class RevenuModule {}
