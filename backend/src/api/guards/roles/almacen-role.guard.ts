import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JWToken } from '../../interceptors/authorization/authorization.interceptor';
import { Role, RoleName } from '../../../db/role-mongo/role-schema';

@Injectable()
export class AlmacenRoleGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt: JWToken = context.switchToHttp().getRequest().jwt;
    return Role.hasNeededRole(jwt.role, RoleName.ALMACEN);
  }
}
