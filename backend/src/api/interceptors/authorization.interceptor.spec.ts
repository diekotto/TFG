import { AuthorizationInterceptor } from './authorization.interceptor';

describe('AuthorizationInterceptor', () => {
  it('should be defined', () => {
    expect(new AuthorizationInterceptor()).toBeDefined();
  });
});
