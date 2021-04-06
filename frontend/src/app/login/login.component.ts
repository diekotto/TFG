import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../services/login/login.service';
import { PingService } from '../services/ping/ping.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  myForm: FormGroup;
  loading = true;
  loadingLogin = false;
  loginError = false;
  backendError = false;
  pingSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private loginService: LoginService,
    private pingService: PingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnDestroy(): void {
    if (this.pingSubscription) {
      this.pingSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.pingSubscription = this.pingService.onPing.subscribe((alive: boolean) => {
      if (!alive) {
        this.backendError = true;
        this.loading = false;
        this.openSnackBar('Error: El sistema parece caído');
      } else {
        this.backendError = false;
      }
    });
    const checkBackendAlive = () => {
      setTimeout(() => {
        if (this.backendError) {
          return;
        }
        this.loading = !this.pingService.alive;
        if (this.loading) {
          checkBackendAlive();
        }
      }, 2000);
    };
    checkBackendAlive();
  }

  async login(): Promise<void> {
    if (!this.myForm.valid) {
      console.log('Invalid form');
      return;
    }
    this.loadingLogin = true;
    this.loginError = false;
    try {
      await this.loginService.login(this.myForm.value);
      await this.router.navigate(['dashboard']);
      console.log('Navigated');
    } catch (err) {
      console.log(err);
      this.loginError = true;
      this.openSnackBar('Email y/o contraseña erróneos');
    }
    this.loadingLogin = false;
  }

  openSnackBar(message: string, action = 'Cerrar'): void {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  loginButtonDisabled(): boolean {
    return (this.loading || this.loadingLogin) && !this.backendError;
  }
}
