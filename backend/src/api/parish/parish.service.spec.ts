import { Test, TestingModule } from '@nestjs/testing';
import { ParishService } from './parish.service';

describe('ParishService', () => {
  let service: ParishService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParishService],
    }).compile();

    service = module.get<ParishService>(ParishService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
