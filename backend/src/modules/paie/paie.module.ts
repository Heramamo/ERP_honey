import { Module } from '@nestjs/common';
import { PaieService } from './paie.service';
import { PaieController } from './paie.controller';
import { SaisieFeuilleService } from '../saisie_feuille/saisie_feuille.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PaieController],
  providers: [PaieService, SaisieFeuilleService, PrismaService],
})
export class PaieModule {}
