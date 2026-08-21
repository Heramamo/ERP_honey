import { Test, TestingModule } from '@nestjs/testing';
import { PaieController } from './paie.controller';
import { PaieService } from './paie.service';

describe('PaieController', () => {
  let controller: PaieController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaieController],
      providers: [PaieService],
    }).compile();

    controller = module.get<PaieController>(PaieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
