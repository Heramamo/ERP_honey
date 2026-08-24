import { Controller } from '@nestjs/common';
import { RevenuService } from './revenu.service';

@Controller('revenu')
export class RevenuController {
  constructor(private readonly revenuService: RevenuService) {}
}
