import { Test, TestingModule } from '@nestjs/testing';
import { SaisieFeuilleService } from './saisie_feuille.service';

describe('SaisieFeuilleService', () => {
  let service: SaisieFeuilleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaisieFeuilleService],
    }).compile();

    service = module.get<SaisieFeuilleService>(SaisieFeuilleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
