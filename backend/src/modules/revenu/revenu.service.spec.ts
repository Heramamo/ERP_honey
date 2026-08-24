import { Test, TestingModule } from '@nestjs/testing';
import { RevenuService } from './revenu.service';

describe('RevenuService', () => {
  let service: RevenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RevenuService],
    }).compile();

    service = module.get<RevenuService>(RevenuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
