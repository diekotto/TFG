export interface UserDto {
  id: string;
  name: string;
  email: string;
  active?: boolean;
  actionsHistory?: UserActionDto[];
  comments?: UserCommentDto[];
  permissions?: RoleName[];
  warehouses?: string[];
  accessHistory?: string[];
}

export interface UserActionDto {
  date: string;
  action: string;
}

export interface UserCommentDto {
  author: string;
  comment: string;
}

export enum RoleName {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  ADMINLOCAL = "adminlocal",
  ALMACEN = "almacen",
  RECEPCION = "recepcion",
  FAMILIAR = "familiar",
  CAJA = "caja"
}
