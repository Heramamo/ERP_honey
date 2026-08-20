import { Body, Controller, ForbiddenException, Get, Post, Request, UseGuards } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Enseignants')
@ApiBearerAuth() // Indique à Swagger que TOUTES les routes de ce contrôleur demandent un Token
@UseGuards(JwtAuthGuard)
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}
  //@UseGuards(JwtAuthGuar)
  @ApiBearerAuth()
  @Post('profile')
  @ApiOperation({ summary: 'Compléter le profil Enseignant après inscription' })
  @ApiResponse({ status: 201, description: 'Profil enseignant créé avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 409, description: 'Un profil existe déjà pour cet utilisateur.' })
  async create(@Request() req, @Body() teacherDto:CreateTeacherDto){
    const userId = req.user.sub;
    return this.teachersService.createProfile(userId, teacherDto)
  }

  @Get('profile')
  @ApiOperation({ summary: 'Récupérer le profil enseignant de l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Profil enseignant récupéré.' })
  @ApiResponse({ status: 404, description: 'Aucun profil enseignant trouvé.' })
  async getProfile(@Request() req){
    return this.teachersService.getProfile(req.user.sub)
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les enseignants (ADMIN / RH uniquement)' })
  @ApiResponse({ status: 200, description: 'Liste des enseignants récupérée.' })
  @ApiResponse({ status: 403, description: 'Accès réservé pour admin, RH' })
  async getAll(@Request() req){
    if (!['ADMIN', 'RH'].includes(req.user.role))
      throw new ForbiddenException('Acces reserve pour admin, RH');
    return this.teachersService.getAll()
  }
}
