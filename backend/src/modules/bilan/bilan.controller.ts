import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { BilanService } from './bilan.service';
import { BilanQueryDto } from './dto/bilan-query.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bilan')
export class BilanController {
  constructor(private readonly bilanService: BilanService) {}
  @Get("pole/:id")
  async getBilanPole(@Param('id', ParseIntPipe) id:number, @Query() query:BilanQueryDto){
    return this.bilanService.getBilanPole(id, query.mois)
  }
}
