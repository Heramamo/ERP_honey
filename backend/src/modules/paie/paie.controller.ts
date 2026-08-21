import { Controller } from '@nestjs/common';
import { PaieService } from './paie.service';

@Controller('paie')
export class PaieController {
  constructor(private readonly paieService: PaieService) {}
}
