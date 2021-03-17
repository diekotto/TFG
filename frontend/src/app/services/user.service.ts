import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly user = {} as User;

  constructor() { }

  setCurrent(obj: any): void {
    this.user.jwt = obj.jwt;
    this.user.accessHistory = obj.accessHistory.map((a: string) => new Date(a));
    this.user.actionsHistory = obj.actionsHistory.map((o: any) => ({
      date: new Date(o.date),
      action: o.action,
    }));
    this.user.active = obj.active;
    this.user.comments = obj.comments;
    this.user.email = obj.email;
    this.user.id = obj.id;
    this.user.name = obj.name;
    this.user.permissions = obj.permissions;
  }
}

export interface User {
  jwt: string;
  accessHistory: Date[];
  actionsHistory: UserAction[];
  active: boolean;
  comments: UserComment[];
  email: string;
  id: string;
  name: string;
  permissions: string[];
}

export interface UserAction {
  date: Date;
  action: string;
}

export interface UserComment {
  author: string;
  comment: string;
}
