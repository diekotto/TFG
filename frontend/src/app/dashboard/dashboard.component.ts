import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { UserService } from '../services/user/user.service';
import { Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { PingService } from '../services/ping/ping.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardCommunicationService } from './services/dashboard-communication/dashboard-communication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav: MatSidenav;

  menuOpen = false;
  loading = false;
  backendError = false;
  pingSubscription: Subscription;

  constructor(
    public userService: UserService,
    private loginService: LoginService,
    private pingService: PingService,
    private communication: DashboardCommunicationService,
    private route: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnDestroy(): void {
    if (this.pingSubscription) {
      this.pingSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.pingService.onPing.subscribe((alive: boolean) => {
      this.backendError = !alive;
    });
    if (this.pingService.pingCount < 1) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        const alive = this.pingService.alive;
        if (alive) {
        } else {
          this.backendError = true;
        }
      }, 500);
    }
    const self = this;
    this.communication.onSnackBarMessage((message: string) => {
      self.openSnackBar(message);
    });
  }

  async logout(): Promise<void> {
    await this.loginService.logout();
    await this.route.navigate(['']);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  ngClassContainerMenuOpen(): string {
    return this.menuOpen ? 'panel-open' : '';
  }

  ngClassToggleMenuOpen(): string {
    return this.menuOpen ? 'open' : '';
  }

  openSnackBar(message: string, action = 'Cerrar'): void {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
