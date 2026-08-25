import { Module } from '@nestjs/common';
import { ChargeService } from './charge.service';
import { ChargeController } from './charge.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ChargeController],
  providers: [ChargeService, PrismaService],
})
export class ChargeModule {}
