import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardCommunicationService } from '../../services/dashboard-communication/dashboard-communication.service';
import { WarehouseService } from '../../services/warehouse/warehouse.service';

@Component({
  selector: 'app-warehouse-manager-create',
  templateUrl: './warehouse-manager-create.component.html',
  styleUrls: ['./warehouse-manager-create.component.css']
})
export class WarehouseManagerCreateComponent implements OnInit {
  myForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private service: WarehouseService,
    private communicationService: DashboardCommunicationService
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      headquarter: [''],
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
      await this.service.create(this.myForm.value);
      this.myForm.reset();
      this.communicationService.snackBarEmitMessage('Almacén creado correctamente');
      this.loading = false;
    }, 500);
  }
}
