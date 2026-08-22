import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaieService } from './paie.service';
import { GeneratePaieDto } from './dto/paie.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@ApiTags("Gestion de paie")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('paie')
export class PaieController {
  constructor(private readonly paieService: PaieService) {}
  @Post('generer')
    async generate(@Body() dto: GeneratePaieDto) {
        return this.paieService.generateMonthlyPayroll(dto);
    }
}
