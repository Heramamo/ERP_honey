import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ChargeService } from './charge.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateChargeDto } from './dto/create-charge.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('charge')
export class ChargeController {
  constructor(private readonly chargeService: ChargeService) {}
  @Post()
  async create(@Body() dto:CreateChargeDto){
    return this.chargeService.create(dto)
  }
  @Get()
  async findAll(){
    return this.chargeService.findAll()
  }
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id:number){
      return this.chargeService.findById(id)
  }
}
