import { Test, TestingModule } from '@nestjs/testing';
import { UserMongoService } from './user-mongo.service';

describe('UserMongoService', () => {
  let service: UserMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserMongoService],
    }).compile();

    service = module.get<UserMongoService>(UserMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
