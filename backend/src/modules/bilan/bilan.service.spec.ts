import { Test, TestingModule } from '@nestjs/testing';
import { BilanService } from './bilan.service';

describe('BilanService', () => {
  let service: BilanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BilanService],
    }).compile();

    service = module.get<BilanService>(BilanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
