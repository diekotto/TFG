import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { DashboardCommunicationService } from '../../services/dashboard-communication/dashboard-communication.service';
import { Warehouse } from '../../services/warehouse/warehouse.service';
import { UserManagerDetailService } from '../user-manager-detail/user-manager-detail.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {

  private id: string;
  data: Warehouse;
  myForm: FormGroup;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private service: UserManagerDetailService,
    private fb: FormBuilder,
    private communicationService: DashboardCommunicationService,
  ) { }

  ngOnInit(): void {
    this.id = this.userService.id;
    this.myForm = this.fb.group({
      oldPassword: [null, [Validators.required, Validators.minLength(8)]],
      newPassword: [null, [Validators.required, Validators.minLength(8)]],
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
      await this.service.updatePassword(this.id, this.myForm.value);
      this.myForm.reset();
      this.communicationService.snackBarEmitMessage('Contraseña cambiada');
      this.loading = false;
    }, 500);
  }
}
