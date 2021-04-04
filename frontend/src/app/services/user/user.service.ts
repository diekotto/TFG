import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  static readonly storageKey = 'currentUser';
  private user: User;

  constructor() {
    try {
      this.reload();
    } catch (err) {
      console.log('Login needed');
    }
  }

  setCurrent(obj: any): void {
    const jwtDecoded: any = JSON.parse(atob(obj.jwt.split('.')[1]));
    console.log('jwt', jwtDecoded);
    const user: User = {
      jwt: obj.jwt,
      jwtExpiry: new Date(jwtDecoded.exp),
      accessHistory: obj.accessHistory.map((a: string) => new Date(a)),
      actionsHistory: obj.actionsHistory.map((o: any) => ({
        date: new Date(o.date),
        action: o.action,
      })),
      active: obj.active,
      comments: obj.comments,
      email: obj.email,
      id: obj.id,
      name: obj.name,
      permissions: obj.permissions,
    };
    if (user.jwtExpiry.getTime() < new Date().getTime()) {
      throw new Error('Jwt expired');
    }
    this.user = user;
    this.save();
  }

  logout(): void {
    localStorage.removeItem(UserService.storageKey);
    this.user = null;
    console.log('User storage cleaned');
  }

  reload(): void {
    const user = localStorage.getItem(UserService.storageKey);
    if (!user) {
      throw new Error('Empty user storage');
    }
    this.setCurrent(JSON.parse(user));
  }

  save(): void {
    localStorage.setItem(UserService.storageKey, JSON.stringify(this.user));
  }

  isLoggedIn(): boolean {
    console.log('Loggedin:', !!this.user);
    return !!this.user;
  }
}

export interface User {
  jwt: string;
  jwtExpiry: Date;
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
