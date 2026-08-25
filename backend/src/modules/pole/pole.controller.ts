import { Body, Controller, ForbiddenException, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { PoleService } from './pole.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePoleDto } from './dto/create-pole.dto';
import { isADminRh } from 'src/shared/authorization';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pole')
export class PoleController {
  constructor(private readonly poleService: PoleService) {}
  @Post()
  async create(@Body() dto:CreatePoleDto){
    return this.poleService.create(dto)
  }
  @Get()
  async getAll(@Request() req){
    if (!isADminRh(req.user.role))
      throw new ForbiddenException("Access reserve aux admin et rh")
    return this.poleService.findAll()
  }
}
