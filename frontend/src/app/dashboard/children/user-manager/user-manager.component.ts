import { Component, OnInit } from '@angular/core';
import { UserManagerService } from './user-manager.service';
import { User } from '../../../services/user/user.service';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.css']
})
export class UserManagerComponent implements OnInit {

  users: User[] = [];
  admins: User[] = [];
  loading = true;

  constructor(private service: UserManagerService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.service.fetchAllUsers().then(() => {
        this.users = this.service.splitNotAdmins();
        this.admins = this.service.splitAdmins();
        this.loading = false;
      });
    }, 1000);
  }
}
