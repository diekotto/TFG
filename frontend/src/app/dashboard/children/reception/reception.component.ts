import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { DashboardCommunicationService } from '../../services/dashboard-communication/dashboard-communication.service';
import { Product, ProductLimits, ProductService } from '../../services/product/product.service';
import { ReceptionService } from '../../services/reception/reception.service';

@Component({
  selector: 'app-reception',
  templateUrl: './reception.component.html',
  styleUrls: ['./reception.component.css']
})
export class ReceptionComponent implements OnInit {
  @ViewChild('stepper') stepper: MatHorizontalStepper;

  linearStepper = false;
  limitsAvailable = [10, 13, 17, 22, 27, 32];
  firstStepControl: FormGroup;
  secondStepControl: FormGroup;
  firstStepForm: FormGroup;
  secondStepForm: FormGroup;
  productsForm = this.fb.array([]);
  searching = false;
  loading = true;
  family: FamilyResume = this.defaultFamilyData();
  generatingInvoice = false;
  displayLimitSurpassed = false;

  constructor(
    private fb: FormBuilder,
    private service: ReceptionService,
    private productService: ProductService,
    private communicationService: DashboardCommunicationService,
  ) { }

  ngOnInit(): void {
    this.fetchAllProducts()
      .then((products: Product[]) => {
        const sorted = products.sort((a: Product, b: Product) => {
          if (a.alias < b.alias) {
            return -1;
          }
          if (a.alias > b.alias) {
            return 1;
          }
          return 0;
        });
        sorted.forEach((p: Product) => {
          if (p.alias) {
            this.addProduct(p._id, p.code, p.alias, 0, p.limits, p.pvp);
          }
        });
        return this.initForms();
      }).then(() => {
      this.loading = false;
    });
  }

  initForms(): void {
    this.firstStepControl = this.fb.group({
      familySearched: [false, Validators.requiredTrue],
    });

    this.secondStepControl = this.fb.group({
      productsAdded: [false, Validators.requiredTrue],
      limitNotSurpassed: [true, Validators.requiredTrue]
    });

    this.firstStepForm = this.fb.group({
      name: ['', Validators.required],
      expedient: ['', Validators.required],
      credential: ['', Validators.required],
      special: [false],
      limit: [null, [Validators.required, Validators.min(this.limitsAvailable[0])]]
    });

    this.secondStepForm = this.fb.group({
      products: this.productsForm,
      total: [0, Validators.required],
    });
  }

  fetchAllProducts(): Promise<Product[]> {
    return this.productService.fetchAll();
  }

  onClickLimitButton(limit: number): void {
    this.firstStepForm.get('limit').setValue(limit);
  }

  getMaxProducts(limits: ProductLimits[]): number {
    return limits.find((l: ProductLimits) => l.price === this.family.limit).quantity;
  }

  addProduct(id: string, code: string, name: string, amount: number, limits: ProductLimits[], pvp: number): void {
    this.productsForm.push(
      this.fb.group({
        id: [id, Validators.required],
        code: [code, Validators.required],
        name: [name, Validators.required],
        amount: [amount, [Validators.required, Validators.min(0)]],
        limits: this.fb.array(limits),
        pvp: [pvp, Validators.required]
      }));
  }

  searchFamilyDisabled(): boolean {
    return !this.firstStepForm.valid || this.searching;
  }

  async searchFamily(): Promise<void> {
    if (this.searchFamilyDisabled()) {
      return;
    }
    this.onClickClearReception();
    this.searching = true;
    setTimeout(() => {
      this.searching = false;
      this.family = this.firstStepForm.value;
      this.family.visits = 0;
      this.firstStepControl.get('familySearched').setValue(true);
    }, 3000);
  }

  modifyProductAmount(product: AbstractControl, amount: number, limit: number): void {
    const newValue = product.value + amount;
    if (newValue < 0 || newValue > limit) {
      return;
    }
    product.setValue(newValue);
    const productCount = this.secondStepForm.get('products').value
      .reduce((prev: number, cur: { amount: number }) => prev + cur.amount, 0);
    this.secondStepControl.get('productsAdded').setValue(productCount > 0);
    const pvpSum = this.sumPvpProductsAdded();
    this.secondStepForm.get('total').setValue(pvpSum);
    this.secondStepControl.get('limitNotSurpassed').setValue(pvpSum <= this.family.limit);
    this.displayLimitSurpassed = pvpSum > this.family.limit;
  }

  getSurpassedPvp(): number {
    return this.sumPvpProductsAdded() - this.family.limit;
  }

  sumPvpProductsAdded(): number {
    if (!this.secondStepForm) {
      return 0;
    }
    return this.secondStepForm.get('products').value
      .reduce((prev: number, cur: { amount: number, pvp: number }) => prev + (cur.amount * cur.pvp), 0);
  }

  onClickClearReception(): void {
    this.secondStepControl.get('productsAdded').setValue(false);
    this.secondStepControl.get('limitNotSurpassed').setValue(true);
    this.productsForm.controls.forEach((c: AbstractControl) => {
      c.get('amount').setValue(0);
    });
    this.secondStepForm.get('total').setValue(0);
    this.displayLimitSurpassed = false;
  }

  onClickReset(): void {
    this.resetFamilyForms();
    this.onClickClearReception();
    this.stepper.reset();
  }

  resetFamilyForms(): void {
    this.firstStepControl.get('familySearched').setValue(false);
    this.firstStepForm.reset();
    this.family = this.defaultFamilyData();
  }

  defaultFamilyData(): FamilyResume {
    return {
      name: '',
      expedient: '',
      credential: '',
      special: false,
      visits: 0,
      limit: 10
    };
  }

  onClickGenerateInvoice(): void {
    this.generatingInvoice = true;
  }

  formatNumber(input: number): string {
    return input.toFixed(2);
  }

  decideColorGrayClass(input: number): string {
    return input <= 0 ? 'color-grey' : '';
  }

  disabledClearReceptionButton(): boolean {
    return !this.secondStepControl.valid && !this.displayLimitSurpassed;
  }
}

interface FamilyResume {
  name: string;
  expedient: string;
  credential: string;
  special: boolean;
  visits: number;
  limit: number;
}
