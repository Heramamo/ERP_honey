import { Test, TestingModule } from '@nestjs/testing';
import { SaisieFeuilleController } from './saisie_feuille.controller';
import { SaisieFeuilleService } from './saisie_feuille.service';

describe('SaisieFeuilleController', () => {
  let controller: SaisieFeuilleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaisieFeuilleController],
      providers: [SaisieFeuilleService],
    }).compile();

    controller = module.get<SaisieFeuilleController>(SaisieFeuilleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
