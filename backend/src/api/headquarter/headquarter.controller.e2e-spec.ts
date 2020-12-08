import { Test, TestingModule } from '@nestjs/testing';
import { HeadquarterController } from './headquarter.controller';
import { HeadquarterService } from './headquarter.service';

describe('HeadquarterController (e2e)', () => {
  let controller: HeadquarterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeadquarterController],
      providers: [HeadquarterService],
    }).compile();

    controller = module.get<HeadquarterController>(HeadquarterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
