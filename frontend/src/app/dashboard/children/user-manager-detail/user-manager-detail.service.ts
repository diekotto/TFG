import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { RoleName, UserService } from '../../../services/user/user.service';

export class UserActionDto {
  date: string;
  action: string;
}

export class UserCommentDto {
  author: string;
  comment: string;
}

export class UserDto {
  id?: string;
  name: string;
  email: string;
  password: string;
  active?: boolean;
  actionsHistory?: UserActionDto[];
  comments?: UserCommentDto[];
  permissions?: RoleName[];
  warehouses?: string[];
  accessHistory?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class UserManagerDetailService {

  constructor(private http: HttpClient, private userService: UserService) { }

  updateUser(user: any): Promise<UserDto> {
    if (user.admin) {
      user.permissions.push(RoleName.ADMINLOCAL);
    }
    delete user.admin;
    return this.http.put<UserDto>(`${environment.backend}/user/${user.id}`, user, {
      headers: {
        Authorization: `Bearer ${this.userService.jwt}`,
      },
    }).toPromise()
      .then((data: any) => {
        return Promise.resolve(data);
      })
      .catch(err => this.userService.logoutHttp401(err) as any);
  }

  readUserById(id: string): Promise<UserDto> {
    return this.http.get<UserDto>(`${environment.backend}/user/${id}`, {
      headers: {
        Authorization: `Bearer ${this.userService.jwt}`,
      },
    }).toPromise()
      .then((data: any) => {
        return Promise.resolve(data);
      })
      .catch(err => this.userService.logoutHttp401(err) as any);
  }

  updatePassword(id: string, input: { newPassword: string, oldPassword: string }): Promise<UserDto> {
    return this.http.put<UserDto>(`${environment.backend}/user/${id}/password`,
      input, {
        headers: {
          Authorization: `Bearer ${this.userService.jwt}`,
        },
      }).toPromise()
      .then((data: any) => {
        return Promise.resolve(data);
      })
      .catch(err => this.userService.logoutHttp401(err) as any);
  }
}
