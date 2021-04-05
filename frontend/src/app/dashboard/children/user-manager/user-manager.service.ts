import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RoleName, User, UserService } from '../../../services/user/user.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserManagerService {

  private users: User[] = [];

  constructor(
    private userService: UserService,
    private http: HttpClient
  ) { }

  async fetchAllUsers(): Promise<User[]> {
    return this.http.get(environment.backend + '/user', {
      headers: {
        Authorization: `Bearer ${this.userService.jwt}`
      },
    }).toPromise()
      .then((data: any) => {
        this.users = data;
        return Promise.resolve(data);
      });
  }

  getAllUsers(): User[] {
    return this.users;
  }

  splitAdmins(): User[] {
    return this.users.filter((u: User) => {
      return u.permissions.findIndex((r: RoleName) => {
        return r === RoleName.SUPERADMIN || r === RoleName.ADMIN || r === RoleName.ADMINLOCAL;
      }) > -1;
    });
  }

  splitNotAdmins(): User[] {
    return this.users.filter((u: User) => {
      return !u.permissions.includes(RoleName.SUPERADMIN) &&
        !u.permissions.includes(RoleName.ADMIN) &&
        !u.permissions.includes(RoleName.ADMINLOCAL);
    });
  }

}
