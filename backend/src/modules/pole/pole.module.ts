import { Module } from '@nestjs/common';
import { PoleService } from './pole.service';
import { PoleController } from './pole.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PoleController],
  providers: [PoleService, PrismaService],
})
export class PoleModule {}
