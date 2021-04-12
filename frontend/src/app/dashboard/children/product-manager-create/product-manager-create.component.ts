import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarcodeFormat } from '@zxing/library';
import { DashboardCommunicationService } from '../../services/dashboard-communication/dashboard-communication.service';
import { Product, ProductService, ProductType } from '../../services/product/product.service';

@Component({
  selector: 'app-product-manager-create',
  templateUrl: './product-manager-create.component.html',
  styleUrls: ['./product-manager-create.component.css']
})
export class ProductManagerCreateComponent implements OnInit {
  myForm: FormGroup;
  loading = false;
  allowedScanFormats = [BarcodeFormat.EAN_13];
  scanEnabled = false;
  enableScannerTxt = 'Activar escáner';
  disableScannerTxt = 'Desactivar escáner';
  productDetail: Product;
  priceLimits = [10, 13, 17, 22, 27, 32];
  productTypes = Object.values(ProductType);

  constructor(
    private fb: FormBuilder,
    private service: ProductService,
    private communicationService: DashboardCommunicationService,
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      ean: [''],
      name: ['', Validators.required],
      code: ['', Validators.required],
      price: [null, Validators.required],
      type: [null, Validators.required],
      chargeableOutBudget: [false, Validators.required],
      [`limit${this.priceLimits[0]}e`]: [null, Validators.required],
      [`limit${this.priceLimits[1]}e`]: [null, Validators.required],
      [`limit${this.priceLimits[2]}e`]: [null, Validators.required],
      [`limit${this.priceLimits[3]}e`]: [null, Validators.required],
      [`limit${this.priceLimits[4]}e`]: [null, Validators.required],
      [`limit${this.priceLimits[5]}e`]: [null, Validators.required],
    });
  }

  submitFormDisabled(): boolean {
    return !this.myForm.valid || this.loading;
  }

  async submitForm(): Promise<void> {
    if (this.submitFormDisabled()) {
      return;
    }
    console.log(this.myForm.value);
    setTimeout(async () => {
      await this.service.create(this.myForm.value);
      this.myForm.reset();
      this.communicationService.snackBarEmitMessage('Producto guardado correctamente');
      this.loading = false;
    }, 500);
  }

  scanSuccessHandler(result: any): void {
    this.scanEnabled = false;
    this.loading = true;
    setTimeout(async () => {
      this.productDetail = await this.service.fetchByEan(result);
      this.myForm.get('ean').setValue(result);
      this.loading = false;
    }, 500);
  }

  onClickScanEnable(): void {
    this.scanEnabled = !this.scanEnabled;
  }
}
