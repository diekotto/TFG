import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

type RolePermissionMap = Map<RoleName, RoleName[]>;
export type RoleDocument = Role & Document;

@Schema()
export class Role {
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) roleName: RoleName;
  @Prop() expiry?: Date;

  static permissionMap: RolePermissionMap;

  constructor() {
    if (!Role.permissionMap) {
      Role.permissionMap = Role.initPermissionMap();
    }
  }

  static validateRole(role: string): boolean {
    return Object.keys(RoleName).some((k: string) => RoleName[k] === role);
  }

  static initPermissionMap(): RolePermissionMap {
    const map = new Map<RoleName, RoleName[]>();
    map.set(RoleName.SUPERADMIN, [RoleName.SUPERADMIN]);
    map.set(RoleName.ADMIN, [RoleName.SUPERADMIN, RoleName.ADMIN]);
    map.set(RoleName.ADMINLOCAL, [
      RoleName.SUPERADMIN,
      RoleName.ADMIN,
      RoleName.ADMINLOCAL,
    ]);
    map.set(RoleName.ALMACEN, [
      RoleName.SUPERADMIN,
      RoleName.ADMIN,
      RoleName.ADMINLOCAL,
      RoleName.ALMACEN,
    ]);
    map.set(RoleName.RECEPCION, [
      RoleName.SUPERADMIN,
      RoleName.ADMIN,
      RoleName.ADMINLOCAL,
      RoleName.RECEPCION,
    ]);
    map.set(RoleName.FAMILIAR, [
      RoleName.SUPERADMIN,
      RoleName.ADMIN,
      RoleName.ADMINLOCAL,
      RoleName.FAMILIAR,
    ]);
    map.set(RoleName.CAJA, [
      RoleName.SUPERADMIN,
      RoleName.ADMIN,
      RoleName.ADMINLOCAL,
      RoleName.CAJA,
    ]);
    return map;
  }

  static hasNeededRole(input: RoleName, needed: RoleName): boolean {
    const allowed = Role.permissionMap.get(needed);
    return allowed && allowed.includes(input);
  }
}

export const RoleSchema = SchemaFactory.createForClass(Role);

export enum RoleName {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  ADMINLOCAL = 'adminlocal',
  ALMACEN = 'almacen',
  RECEPCION = 'recepcion',
  FAMILIAR = 'familiar',
  CAJA = 'caja',
}
