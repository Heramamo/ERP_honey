import { Module } from '@nestjs/common';
import { RevenuService } from './revenu.service';
import { RevenuController } from './revenu.controller';

@Module({
  controllers: [RevenuController],
  providers: [RevenuService],
})
export class RevenuModule {}
