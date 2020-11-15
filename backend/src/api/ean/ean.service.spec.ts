import { Test, TestingModule } from '@nestjs/testing';
import { EanService } from './ean.service';

describe('EanService', () => {
  let service: EanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EanService],
    }).compile();

    service = module.get<EanService>(EanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
