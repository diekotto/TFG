import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarcodeFormat } from '@zxing/library';
import { DashboardCommunicationService } from '../../services/dashboard-communication/dashboard-communication.service';
import { Product, ProductService } from '../../services/product/product.service';

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

  constructor(
    private fb: FormBuilder,
    private service: ProductService,
    private communicationService: DashboardCommunicationService,
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      ean_disabled: [{
        value: '',
        disabled: true,
      }],
      ean: ['', Validators.required],
      name: ['', Validators.required],
      code: ['', Validators.required],
      price: [0.00, Validators.required],
      [`limit${this.priceLimits[0]}e`]: [0],
      [`limit${this.priceLimits[1]}e`]: [0],
      [`limit${this.priceLimits[2]}e`]: [0],
      [`limit${this.priceLimits[3]}e`]: [0],
      [`limit${this.priceLimits[4]}e`]: [0],
      [`limit${this.priceLimits[5]}e`]: [0],
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
      await this.service.updateByEan(this.myForm.value);
      this.myForm.reset();
      this.communicationService.snackBarEmitMessage('Producto guardado correctamente');
      this.loading = false;
    }, 1500);
  }

  scanSuccessHandler(result: any): void {
    this.scanEnabled = false;
    this.loading = true;
    setTimeout(async () => {
      this.productDetail = await this.service.fetchByEan(result);
      this.myForm.get('ean').setValue(result);
      this.myForm.get('ean_disabled').setValue(result);
      this.loading = false;
    }, 1000);
  }

  onClickScanEnable(): void {
    this.scanEnabled = !this.scanEnabled;
  }

  onPriceKeyUp(): void {
    const price = this.myForm.get('price').value;
    const regex = /^(\d+)[.,](\d*)$/;
    const g = regex.exec(price);
    if (regex.test(price) && g[2] && g[2].length > 2) {
      this.myForm.get('price').setValue(Number(`${g[1]}.${g[2].substring(0, 2)}`));
    }
  }

  onLimitUpdated(): void {
    let lastPrice = 0;
    this.priceLimits.forEach((p: number) => {
      let currentPrice = this.myForm.get(`limit${p}e`).value;
      this.myForm.get(`limit${p}e`).setValue(Number(currentPrice));
      if (currentPrice < lastPrice) {
        this.myForm.get(`limit${p}e`).setValue(lastPrice);
        currentPrice = lastPrice;
      }
      lastPrice = currentPrice;
    });
  }
}
