import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DashboardCommunicationService } from '../../services/dashboard-communication/dashboard-communication.service';
import { Warehouse, WarehouseService } from '../../services/warehouse/warehouse.service';

@Component({
  selector: 'app-warehouse-manager-detail',
  templateUrl: './warehouse-manager-detail.component.html',
  styleUrls: ['./warehouse-manager-detail.component.css'],
})
export class WarehouseManagerDetailComponent implements OnInit {

  private id: string;
  data: Warehouse;
  myForm: FormGroup;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private service: WarehouseService,
    private fb: FormBuilder,
    private communicationService: DashboardCommunicationService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.service.readById(this.id).then((data: Warehouse) => {
        this.data = data;
        this.myForm = this.fb.group({
          name: [data.name, Validators.required],
        });
        this.loading = false;
      });
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
      await this.service.update(this.id, this.myForm.value);
      this.communicationService.snackBarEmitMessage('Almacén guardado correctamente');
      this.loading = false;
    }, 500);
  }
}
