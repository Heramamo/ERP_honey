import { Body, Controller, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { PaieService } from './paie.service';
import { GeneratePaieDto, UpdateStatutPaieDto } from './dto/paie.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@ApiTags("Gestion de paie")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('paie')
export class PaieController {
  constructor(private readonly paieService: PaieService) { }
  @Post('generer')
  async generate(@Body() dto: GeneratePaieDto) {
    return this.paieService.generateMonthlyPayroll(dto);
  }
  @Get('all')
  async getAllPayrolls(@Request() req, @Query('mois') mois?: string) {
    if (!['RH', 'ADMIN'].includes(req.user.role))
      throw new ForbiddenException("Access refuse")
    return await this.paieService.getAllPayrolls(mois)
  }
  @Patch(':id/statut')
  async updateStatus(
    @Param('id', ParseIntPipe) paieId: number,
    @Body() dto: UpdateStatutPaieDto
  ) {
    return this.paieService.updateStatus(paieId, dto);
  }

}
