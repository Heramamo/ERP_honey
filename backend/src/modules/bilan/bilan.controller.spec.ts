import { Test, TestingModule } from '@nestjs/testing';
import { BilanController } from './bilan.controller';
import { BilanService } from './bilan.service';

describe('BilanController', () => {
  let controller: BilanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BilanController],
      providers: [BilanService],
    }).compile();

    controller = module.get<BilanController>(BilanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
