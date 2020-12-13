import { Test, TestingModule } from '@nestjs/testing';
import { HeadquarterService } from './headquarter.service';
import { HeadquarterMongoService } from '../../db/headquarter-mongo/headquarter-mongo.service';

describe('HeadquarterService', () => {
  let service: HeadquarterService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeadquarterService, HeadquarterMongoService],
    })
      .overrideProvider(HeadquarterMongoService)
      .useValue({})
      .compile();

    service = module.get<HeadquarterService>(HeadquarterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
