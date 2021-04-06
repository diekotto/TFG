import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleName, UserService } from '../../../services/user/user.service';
import { UserManagerCreateService } from './user-manager-create.service';
import { DashboardCommunicationService } from '../../services/dashboard-communication/dashboard-communication.service';

@Component({
  selector: 'app-user-manager-create',
  templateUrl: './user-manager-create.component.html',
  styleUrls: ['./user-manager-create.component.css']
})
export class UserManagerCreateComponent implements OnInit {

  myForm: FormGroup;
  permissions: string[] = [];
  loading = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private service: UserManagerCreateService,
    private communicationService: DashboardCommunicationService,
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      admin: false,
      active: false,
      name: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', [Validators.required, Validators.minLength(8)]],
      permissions: [[]]
    });
    this.permissions = Object.values(RoleName).filter((r: string) => {
      return r !== RoleName.ADMINLOCAL && r !== RoleName.ADMIN && r !== RoleName.SUPERADMIN;
    });
  }

  submitFormDisabled(): boolean {
    return !this.myForm.valid;
  }

  async submitForm(): Promise<void> {
    if (!this.myForm.valid) {
      return;
    }
    this.loading = true;
    await this.service.createUser(this.myForm.value);
    this.myForm.reset();
    this.communicationService.snackBarEmitMessage('Usuario creado correctamente');
    this.loading = false;
  }
}
