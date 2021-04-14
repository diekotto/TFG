import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Jwt = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.jwt;
  },
);
