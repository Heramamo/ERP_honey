import { Controller } from '@nestjs/common';
import { ChargeService } from './charge.service';

@Controller('charge')
export class ChargeController {
  constructor(private readonly chargeService: ChargeService) {}
}
