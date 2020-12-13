import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JWToken } from '../jwtoken.interface';
import { Role, RoleName } from '../../../db/role-mongo/role-schema';

@Injectable()
export class WarehouseGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const token: JWToken = req['jwt'];
    if (token.roles.some((r: RoleName) => Role.multiHeadquarterRole(r)))
      return true;
    const warehouse = req.params.id;
    return token.warehouses.includes(warehouse);
  }
}
