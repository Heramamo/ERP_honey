import { Module } from '@nestjs/common';
import { PaieService } from './paie.service';
import { PaieController } from './paie.controller';

@Module({
  controllers: [PaieController],
  providers: [PaieService],
})
export class PaieModule {}
