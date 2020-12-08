import { Test, TestingModule } from '@nestjs/testing';
import { HeadquarterService } from './headquarter.service';

describe('HeadquarterService', () => {
  let service: HeadquarterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeadquarterService],
    }).compile();

    service = module.get<HeadquarterService>(HeadquarterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
