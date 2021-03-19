import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  myForm: FormGroup;
  loading = true;
  loginError = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.loading = false;
  }

  async login(): Promise<void> {
    if (!this.myForm.valid) {
      console.log('Invalid form');
      return;
    }
    this.loading = true;
    this.loginError = false;
    let response: any;
    try {
      response = await this.http.post(environment.backend + '/login', this.myForm.value).toPromise();
      this.userService.setCurrent({ jwt: response.jwt, ...response.user });
      await this.router.navigate(['dashboard']);
      console.log('Navigated');
    } catch (err) {
      console.log(err);
      this.loginError = true;
      this.openSnackBar('Email y/o contraseña erróneos');
    }
    this.loading = false;
  }

  openSnackBar(message: string, action = 'Cerrar'): void {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
