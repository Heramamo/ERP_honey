import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RevenuService } from './revenu.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRevenuDto } from './dto/create-revenu.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('revenu')
export class RevenuController {
  constructor(private readonly revenuService: RevenuService) { }
  @Post()
  async create(@Body() dto:CreateRevenuDto) {
    return await this.revenuService.create(dto)
  }
}
