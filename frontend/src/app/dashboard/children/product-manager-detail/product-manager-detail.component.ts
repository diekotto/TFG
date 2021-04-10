import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DashboardCommunicationService } from '../../services/dashboard-communication/dashboard-communication.service';
import { Product, ProductLimits, ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-product-manager-detail',
  templateUrl: './product-manager-detail.component.html',
  styleUrls: ['./product-manager-detail.component.css']
})
export class ProductManagerDetailComponent implements OnInit {

  loadingProduct = true;
  ean: string;
  product: Product;
  myForm: FormGroup;
  loading = false;
  priceLimits = [10, 13, 17, 22, 27, 32];

  constructor(
    private fb: FormBuilder,
    private service: ProductService,
    private communicationService: DashboardCommunicationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.initDetail(params.ean));
  }

  async initDetail(ean: string): Promise<void> {
    this.ean = ean;
    this.product = await this.service.fetchByEan(ean);
    this.myForm = this.fb.group({
      ean_disabled: [{
        value: ean,
        disabled: true,
      }],
      ean: [ean, Validators.required],
      name: [this.product.alias, Validators.required],
      code: [this.product.code, Validators.required],
      price: [this.product.pvp, Validators.required],
      [`limit${this.priceLimits[0]}e`]: [
        this.product.limits.find((l: ProductLimits) =>
          l.price === this.priceLimits[0]).quantity
      ],
      [`limit${this.priceLimits[1]}e`]: [
        this.product.limits.find((l: ProductLimits) =>
          l.price === this.priceLimits[1]).quantity
      ],
      [`limit${this.priceLimits[2]}e`]: [
        this.product.limits.find((l: ProductLimits) =>
          l.price === this.priceLimits[2]).quantity
      ],
      [`limit${this.priceLimits[3]}e`]: [
        this.product.limits.find((l: ProductLimits) =>
          l.price === this.priceLimits[3]).quantity
      ],
      [`limit${this.priceLimits[4]}e`]: [
        this.product.limits.find((l: ProductLimits) =>
          l.price === this.priceLimits[4]).quantity
      ],
      [`limit${this.priceLimits[5]}e`]: [
        this.product.limits.find((l: ProductLimits) =>
          l.price === this.priceLimits[5]).quantity
      ],
    });
    this.loadingProduct = false;
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
      this.communicationService.snackBarEmitMessage('Producto guardado correctamente');
      this.loading = false;
    }, 1500);
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
