import { Test, TestingModule } from '@nestjs/testing';
import { RoleMongoService } from './role-mongo.service';

describe('RoleMongoService', () => {
  let service: RoleMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleMongoService],
    }).compile();

    service = module.get<RoleMongoService>(RoleMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
