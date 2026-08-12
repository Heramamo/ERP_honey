import { Module } from '@nestjs/common';
import { SaisieFeuilleService } from './saisie_feuille.service';
import { SaisieFeuilleController } from './saisie_feuille.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SaisieFeuilleController],
  providers: [SaisieFeuilleService, PrismaService],
})
export class SaisieFeuilleModule {}
