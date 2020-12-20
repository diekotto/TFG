import { RoleName } from '../../db/role-mongo/role-schema';

export interface JWToken {
  iat: number; // POSIX CREATED
  id: string; // ID USER
  exp: number; // POSIX EXPIRY
  roles: RoleName[];
  warehouses: string[];
}
