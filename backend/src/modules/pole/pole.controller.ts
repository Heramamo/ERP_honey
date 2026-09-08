import { Body, Controller, ForbiddenException, Get, Post, Query, Req, Request, UseGuards } from '@nestjs/common';
import { PoleService } from './pole.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePoleDto } from './dto/create-pole.dto';
import { isADminRh } from 'src/shared/authorization';
import { GetPoleByNameDto } from './dto/getPole.dto';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pole')
export class PoleController {
  constructor(private readonly poleService: PoleService) {}
  @Post()
  async create(@Body() dto:CreatePoleDto){
    return this.poleService.create({nom:dto.nom.toUpperCase(), description:dto.description})
  }
  @Get()
  async getAll(@Request() req){
    if (!isADminRh(req.user.role))
      throw new ForbiddenException("Access reserve aux admin et rh")
    return this.poleService.findAll()
  }
  
  @Get("name")
  async getPoleByName(@Query('nom') nom:string)
  {
    return this.poleService.getPoleByName(nom.toUpperCase())
  } 
}
