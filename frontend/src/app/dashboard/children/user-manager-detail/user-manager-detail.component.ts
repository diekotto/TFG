import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RoleName, UserService } from '../../../services/user/user.service';
import { DashboardCommunicationService } from '../../services/dashboard-communication/dashboard-communication.service';
import { UserDto, UserManagerDetailService } from './user-manager-detail.service';

@Component({
  selector: 'app-user-manager-detail',
  templateUrl: './user-manager-detail.component.html',
  styleUrls: ['./user-manager-detail.component.css'],
})
export class UserManagerDetailComponent implements OnInit {

  userId = '';
  myForm: FormGroup;
  loading = true;
  permissions: string[] = [];
  user: UserDto;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: UserManagerDetailService,
    private userService: UserService,
    private communicationService: DashboardCommunicationService,
  ) { }

  ngOnInit(): void {
    this.permissions = Object.values(RoleName).filter((r: string) => {
      return r !== RoleName.ADMINLOCAL && r !== RoleName.ADMIN && r !== RoleName.SUPERADMIN;
    });
    this.route.params.subscribe(params => {
      this.userId = params.id;
      this.service.readUserById(this.userId).then((data: UserDto) => {
        this.user = data;
        this.readUserAndLoadData(data);
      });
    });
  }

  readUserAndLoadData(data: UserDto): void {
    this.myForm = this.fb.group({
      id: data.id,
      admin: this.userService.isAdminLocal(data as any),
      active: data.active,
      name: [data.name, Validators.required],
      email: [data.email, Validators.email],
      password: [''],
      permissions: [data.permissions.filter((r: string) => {
        return r !== RoleName.ADMINLOCAL && r !== RoleName.ADMIN && r !== RoleName.SUPERADMIN;
      })],
      changePassword: [false],
    });
    this.loading = false;
  }

  submitFormDisabled(): boolean {
    return !this.myForm.valid || this.loading;
  }

  async submitForm(): Promise<void> {
    if (this.submitFormDisabled()) {
      return;
    }
    this.loading = true;
    setTimeout(async () => {
      const user: UserDto = await this.service.updateUser(this.myForm.value);
      this.myForm.reset();
      this.communicationService.snackBarEmitMessage('Usuario actualizado correctamente');
      this.readUserAndLoadData(user);
    }, 500);
  }
}
