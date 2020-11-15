import { Test, TestingModule } from '@nestjs/testing';
import { EanController } from './ean.controller';

describe('EanController', () => {
  let controller: EanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EanController],
    }).compile();

    controller = module.get<EanController>(EanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
