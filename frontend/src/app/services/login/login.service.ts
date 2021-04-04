import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserService } from '../user/user.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private userService: UserService,
    private http: HttpClient,
  ) { }

  async login(data: { email: string, password: string }): Promise<any> {
    const response: any = await this.http.post(environment.backend + '/login', data).toPromise();
    this.userService.setCurrent({ jwt: response.jwt, ...response.user });
    return response;
  }

  async logout(): Promise<void> {
    await this.userService.logout();
  }
}
