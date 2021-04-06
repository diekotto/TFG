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
  displayProductDetail = false;
  displayProductDetailTxt = 'Ver ficha del producto';
  notDisplayProductDetailTxt = 'Ocultar ficha del producto';

  constructor(
    private fb: FormBuilder,
    private service: ProductService,
    private communicationService: DashboardCommunicationService,
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      ean: ['']
    });
  }

  submitFormDisabled(): boolean {
    return !this.myForm.valid || this.loading;
  }

  async submitForm(): Promise<void> {
    // TODO: quitar este bloqueo
    if (this.submitFormDisabled() || true) {
      return;
    }
    this.loading = true;
    setTimeout(async () => {
      await this.service.create(this.myForm.value);
      this.myForm.reset();
      this.communicationService.snackBarEmitMessage('Almacén creado correctamente');
      this.loading = false;
    }, 1500);
  }

  scanSuccessHandler(result: any): void {
    this.scanEnabled = false;
    this.loading = true;
    setTimeout(async () => {
      this.productDetail = await this.service.fetchByEan(result);
      this.myForm.get('ean').setValue(result);
      this.loading = false;
    }, 1000);
  }

  onClickScanEnable(): void {
    this.scanEnabled = !this.scanEnabled;
  }

  onCLickShowProductDetails(): void {
    this.displayProductDetail = !this.displayProductDetail;
  }
}
