import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from './login.service';
import { UserMongoService } from '../../db/user-mongo/user-mongo.service';
import { ConfigService } from '@nestjs/config';

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginService, UserMongoService, ConfigService],
    })
      .overrideProvider(UserMongoService)
      .useValue({})
      .overrideProvider(ConfigService)
      .useValue({})
      .compile();

    service = module.get<LoginService>(LoginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
