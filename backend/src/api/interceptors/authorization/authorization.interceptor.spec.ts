import { AuthorizationInterceptor } from './authorization.interceptor';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

describe('AuthorizationInterceptor', () => {
  let service: AuthorizationInterceptor;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [AuthorizationInterceptor],
    }).compile();

    service = module.get<AuthorizationInterceptor>(AuthorizationInterceptor);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
