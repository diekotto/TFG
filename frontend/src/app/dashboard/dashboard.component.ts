import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(
    private userService: UserService,
    private route: Router) { }

  ngOnInit(): void {
  }

  async close(): Promise<void> {
    await this.sidenav.close();
  }

  async logout(): Promise<void> {
    this.userService.logout();
    await this.route.navigate(['']);
  }
}
