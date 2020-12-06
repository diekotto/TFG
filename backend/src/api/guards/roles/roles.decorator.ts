import { SetMetadata } from '@nestjs/common';
import { RoleName } from '../../../db/role-mongo/role-schema';

export const Roles = (...roles: RoleName[]) => SetMetadata('roles', roles);
