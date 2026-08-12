import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { SaisieFeuilleService } from './saisie_feuille.service';
import { CreateSaisieFeuilleDto } from './dto/create-saisie-feuille.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Feuilles de Temps')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('saisie-feuille')
export class SaisieFeuilleController {
  constructor(private readonly saisieFeuilleService: SaisieFeuilleService) {}

  @Post()
  @ApiOperation({ summary: 'Déclarer des heures de travail (Enseignant connecté)' })
  async create(@Body() dto:CreateSaisieFeuilleDto, @Request() req){
      return this.saisieFeuilleService.create(req.user.sub, dto)
  }
}
