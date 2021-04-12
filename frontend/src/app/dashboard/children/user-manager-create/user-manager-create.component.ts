import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleName } from '../../../services/user/user.service';
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
  loading = false;

  constructor(
    private fb: FormBuilder,
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
    return !this.myForm.valid || this.loading;
  }

  async submitForm(): Promise<void> {
    if (this.submitFormDisabled()) {
      return;
    }
    this.loading = true;
    setTimeout(async () => {
      await this.service.createUser(this.myForm.value);
      this.myForm.reset();
      this.communicationService.snackBarEmitMessage('Usuario creado correctamente');
      this.loading = false;
    }, 500);
  }
}
