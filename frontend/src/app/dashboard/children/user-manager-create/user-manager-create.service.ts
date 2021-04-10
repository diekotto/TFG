import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { RoleName, UserService } from '../../../services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagerCreateService {

  constructor(private http: HttpClient,
              private userService: UserService) { }

  createUser(user: any): Promise<any> {
    if (user.admin) {
      user.permissions.push(RoleName.ADMINLOCAL);
    }
    delete user.admin;
    return this.http.post(environment.backend + '/user', user, {
      headers: {
        Authorization: `Bearer ${this.userService.jwt}`
      }
    }).toPromise();
  }
}
