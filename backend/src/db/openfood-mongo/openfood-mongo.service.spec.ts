import { Test, TestingModule } from '@nestjs/testing';
import { OpenfoodMongoService } from './openfood-mongo.service';

describe('OpenfoodMongoService', () => {
  let service: OpenfoodMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenfoodMongoService],
    }).compile();

    service = module.get<OpenfoodMongoService>(OpenfoodMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
