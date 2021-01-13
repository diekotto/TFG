import { Test, TestingModule } from '@nestjs/testing';
import { FamilyMongoService } from './family-mongo.service';

describe('FamilyMongoService', () => {
  let service: FamilyMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FamilyMongoService],
    }).compile();

    service = module.get<FamilyMongoService>(FamilyMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
