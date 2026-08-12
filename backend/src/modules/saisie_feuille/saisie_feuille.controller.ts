import { Body, Controller, ForbiddenException, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { SaisieFeuilleService } from './saisie_feuille.service';
import { CreateSaisieFeuilleDto } from './dto/create-saisie-feuille.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ValidateSaisieFeuilleDto } from './dto/validate-saisie-feuille.dto';

@ApiTags('Feuilles de Temps')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('saisie-feuille')
export class SaisieFeuilleController {
  constructor(private readonly saisieFeuilleService: SaisieFeuilleService) { }

  @Post()
  @ApiOperation({ summary: 'Déclarer des heures de travail (Enseignant connecté)' })
  async create(@Body() dto: CreateSaisieFeuilleDto, @Request() req) {
    return this.saisieFeuilleService.create(req.user.sub, dto)
  }
  @Patch(':id/valider')
  @ApiOperation({ summary: 'Valider ou refuser une feuille de temps (RH / ADMIN)' })
  async validate(@Body() dto: ValidateSaisieFeuilleDto, @Request() req, @Param('id', ParseIntPipe) id: number) {
    if (!['ADMIN', 'RH'].includes(req.user.role))
      throw new ForbiddenException('Acces reserve pour admin, RH');
    return this.saisieFeuilleService.validate(id, req.user.sub, dto)
  }
}
