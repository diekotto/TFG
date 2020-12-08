import { Test, TestingModule } from '@nestjs/testing';
import { HeadquarterMongoService } from './headquarter-mongo.service';

describe('HeadquarterMongoService', () => {
  let service: HeadquarterMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeadquarterMongoService],
    }).compile();

    service = module.get<HeadquarterMongoService>(HeadquarterMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
