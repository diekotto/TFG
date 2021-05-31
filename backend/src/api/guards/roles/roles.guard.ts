import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Role, RoleName } from '../../../db/role-mongo/role-schema';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { JWToken } from '../jwtoken.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<RoleName[]>('roles', context.getHandler());
    if (!roles) throw new InternalServerErrorException('Roles needed in route');
    if (roles.length < 1) return true;
    const req: Request = context.switchToHttp().getRequest();
    const token: JWToken = req['jwt'];
    if (roles.includes(RoleName.OWNER)) {
      if (roles.length === 1) return req.params.id === token.id;
      if (req.params.id === token.id) return true;
    }
    return roles
      .filter((role) => role !== RoleName.OWNER)
      .some((role) => Role.hasNeededRole(token.roles, role));
  }
}
