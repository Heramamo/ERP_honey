import { Controller } from '@nestjs/common';
import { PoleService } from './pole.service';

@Controller('pole')
export class PoleController {
  constructor(private readonly poleService: PoleService) {}
}
