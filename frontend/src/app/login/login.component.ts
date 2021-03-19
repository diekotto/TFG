import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  myForm: FormGroup;
  loading = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      email: [''],
      password: [''],
    });
    this.loading = false;
  }

  async login(): Promise<void> {
    this.loading = true;
    let response: any;
    try {
      response = await this.http.post(environment.backend + '/login', this.myForm.value).toPromise();
      this.userService.setCurrent({ jwt: response.jwt, ...response.user });
      await this.router.navigate(['dashboard']);
    } catch (err) {
      console.log(err);
    }
    this.loading = false;
  }

}
