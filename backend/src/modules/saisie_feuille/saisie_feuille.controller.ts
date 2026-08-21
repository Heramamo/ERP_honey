import { Body, Controller, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { SaisieFeuilleService } from './saisie_feuille.service';
import { CreateSaisieFeuilleDto } from './dto/create-saisie-feuille.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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

  @Get()
  @ApiOperation({summary:"Recuperer tous les saisie"})
  async getAll(@Request() req){
     if (!['ADMIN', 'RH'].includes(req.user.role))
      throw new ForbiddenException('Acces reserve pour admin, RH');
    return this.saisieFeuilleService.getAllSaisie()
  }

  @Get('me')
  @ApiOperation({summary:"Recuperation des saisie de l'enseignant"})
  async getMySaisie(@Request() req){
    return this.saisieFeuilleService.getMySaisie(req.user.sub)
  }

  @Get('pending')
  @ApiOperation({summary:"Recuperer les saisie en attente de validation"})
  async getPendingSaisie(){
    return this.saisieFeuilleService.getPendingSaisie()
  }
  @Get('pending/me')
  async getMyPendingSaisie(@Request() req){
    return  this.saisieFeuilleService.getMyPendingSaisie(req.user.sub as number);
  }
  @Get(':id/month')
  @ApiResponse({summary:"Liste des feuille du mois"})
  async getMonthSaisie(@Param('id', ParseIntPipe) id:number){
    return this.saisieFeuilleService.calculMonthSalary(id)
  }
}
