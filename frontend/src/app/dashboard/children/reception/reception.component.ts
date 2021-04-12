import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { DashboardCommunicationService } from '../../services/dashboard-communication/dashboard-communication.service';
import { Product, ProductLimits, ProductService } from '../../services/product/product.service';
import { FamilyResume, InvoiceDto, ProductResume, ReceptionService } from '../../services/reception/reception.service';

@Component({
  selector: 'app-reception',
  templateUrl: './reception.component.html',
  styleUrls: ['./reception.component.css']
})
export class ReceptionComponent implements OnInit {
  @ViewChild('stepper') stepper: MatHorizontalStepper;

  // TODO: Botón de activar o desactivar que las facturas restrinjan el pedido actual enableRelatedInvoiceRestrictions
  linearStepper = true;
  limitsAvailable = [10, 13, 17, 22, 27, 32];
  firstStepControl: FormGroup;
  secondStepControl: FormGroup;
  firstStepForm: FormGroup;
  secondStepForm: FormGroup;
  productsForm = this.fb.array([]);
  productsInvoice: ProductResume[] = [];
  searching = false;
  loading = true;
  family: FamilyResume = this.defaultFamilyData();
  familyRelatedInvoices: InvoiceDto[] = [];
  enabledRelatedInvoices: { [index: string]: InvoiceDto } = {};
  enableRelatedInvoiceTxt = 'Activar restricciones';
  disableRelatedInvoiceTxt = 'Desactivar restricciones';
  generatingInvoice = false;
  invoice: InvoiceDto = null;
  displayLimitSurpassed = false;
  generateInvoiceTxt = 'Generar factura';
  openInvoiceTxt = 'Abrir factura';

  constructor(
    private fb: FormBuilder,
    private service: ReceptionService,
    public productService: ProductService,
    private communicationService: DashboardCommunicationService,
  ) { }

  ngOnInit(): void {
    this.fetchAllProducts()
      .then((products: Product[]) => {
        const sorted = products.sort((a: Product, b: Product) => {
          if (a.type === b.type) {
            if (a.alias < b.alias) {
              return -1;
            }
            if (a.alias > b.alias) {
              return 1;
            }
            return 0;
          } else {
            if (a.type < b.type) {
              return -1;
            }
            if (a.type > b.type) {
              return 1;
            }
            return 0;
          }
        });
        sorted.forEach((p: Product) => {
          if (p.alias) {
            this.addProduct(p);
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
      productsCount: [0],
    });
  }

  fetchAllProducts(): Promise<Product[]> {
    return this.productService.fetchAll();
  }

  onClickLimitButton(limit: number): void {
    this.firstStepForm.get('limit').setValue(limit);
  }

  getMaxProducts(limits: ProductLimits[], productId: string): number {
    let subtractLimit = 0;
    Object.keys(this.enabledRelatedInvoices).forEach((i: string) => {
      const product = this.enabledRelatedInvoices[i].products.find((p: ProductResume) => p.id === productId);
      if (product) {
        subtractLimit += product.amount;
      }
    });
    return limits.find((l: ProductLimits) => {
      return l.price === this.family.originalLimit;
    }).quantity - subtractLimit;
  }

  addProduct(p: Product, amount = 0): void {
    this.productsForm.push(
      this.fb.group({
        id: [p._id, Validators.required],
        code: [p.code, Validators.required],
        ean: [p.ean, Validators.required],
        name: [p.alias, Validators.required],
        amount: [amount, [Validators.required, Validators.min(0)]],
        limits: this.fb.array(p.limits),
        pvp: [p.pvp, Validators.required],
        type: [p.type],
        chargeableOutBudget: [p.chargeableOutBudget],
        chargeableOutBudgetSelected: [false]
      }));
  }

  toggleChargeableOutBudget(control: AbstractControl): void {
    if (control.get('chargeableOutBudget').value) {
      control.get('chargeableOutBudgetSelected').setValue(!control.get('chargeableOutBudgetSelected').value);
    }
    this.modifyProductAmount(control.get('amount'), 0);
  }

  colorChargeableOutBudget(control: AbstractControl): ThemePalette {
    return control.get('chargeableOutBudgetSelected').value ?
      'accent' : '' as ThemePalette;
  }

  productTableTrColorClass(control: AbstractControl): string {
    if (control.get('amount').value > 0 && control.get('chargeableOutBudgetSelected').value) {
      return 'table-primary';
    }
    return control.get('amount').value > 0 &&
    this.getSurpassedPvp() > 0 ?
      'table-warning' : '';
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
    setTimeout(async () => {
      try {
        const temp = this.firstStepForm.value;
        this.familyRelatedInvoices = await this.service.findFamilyCurrentMonth(temp.credential, temp.expedient);
        this.family = temp;
        this.family.originalLimit = this.family.limit;
        this.family.visits = this.familyRelatedInvoices.length;
      } catch (e) {
        this.family.visits = 0;
        this.communicationService.snackBarEmitMessage('Ha habido un error buscando la familiar en el sistema');
      }
      this.familyRelatedInvoices.forEach((rel: InvoiceDto, i: number) => {
        this.toggleRelatedInvoiceRestrictions(i, rel._id);
      });
      setTimeout(() => {
        this.firstStepControl.get('familySearched').setValue(true);
        this.stepper.next();
        this.searching = false;
      }, 500);
    }, 500);
  }

  modifyProductAmount(amountControl: AbstractControl, amount: number): void {
    const newValue = amountControl.value + amount;
    amountControl.setValue(newValue);
    const productCount = this.secondStepForm.get('products').value
      .reduce((prev: number, cur: { amount: number }) => prev + cur.amount, 0);
    this.secondStepControl.get('productsAdded').setValue(productCount > 0);
    const pvpSum = this.sumPvpProductsAdded();
    const pvpSumOutBudget = this.sumPvpProductsOutBudgetAdded();
    this.secondStepForm.get('total').setValue(pvpSum + pvpSumOutBudget);
    this.secondStepForm.get('productsCount').setValue(this.secondStepForm.get('productsCount').value + amount);
    this.secondStepControl.get('limitNotSurpassed').setValue(pvpSum <= this.family.limit);
    this.displayLimitSurpassed = pvpSum > this.family.limit;
  }

  getSurpassedPvp(): number {
    const pvpSum = this.sumPvpProductsAdded();
    return pvpSum - this.family.limit;
  }

  sumPvpProductsAdded(): number {
    if (!this.secondStepForm) {
      return 0;
    }
    return Number(this.secondStepForm.get('products').value
      .reduce((prev: number, cur: Product & { amount: number, chargeableOutBudgetSelected: boolean }) => {
        if (cur.chargeableOutBudget && cur.chargeableOutBudgetSelected) {
          return prev;
        }
        return prev + (cur.amount * cur.pvp);
      }, 0).toFixed(2));
  }

  sumPvpProductsOutBudgetAdded(): number {
    if (!this.secondStepForm) {
      return 0;
    }
    return Number(this.secondStepForm.get('products').value
      .reduce((prev: number, cur: Product & { amount: number, chargeableOutBudgetSelected: boolean }) => {
        if (cur.chargeableOutBudget && cur.chargeableOutBudgetSelected) {
          return prev + (cur.amount * cur.pvp);
        }
        return prev;
      }, 0).toFixed(2));
  }

  onClickClearReception(): void {
    this.secondStepControl.get('productsAdded').setValue(false);
    this.secondStepControl.get('limitNotSurpassed').setValue(true);
    this.productsForm.controls.forEach((c: AbstractControl) => {
      c.get('amount').setValue(0);
      c.get('chargeableOutBudgetSelected').setValue(false);
    });
    this.secondStepForm.get('total').setValue(0);
    this.invoice = null;
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
    this.familyRelatedInvoices = [];
    this.enabledRelatedInvoices = {};
  }

  defaultFamilyData(): FamilyResume {
    return {
      name: '',
      expedient: '',
      credential: '',
      special: false,
      visits: 0,
      limit: 10,
      originalLimit: 10,
    };
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

  prepareInvoice(): void {
    this.productsInvoice = this.productsForm.controls
      .filter((p: AbstractControl) => p.get('amount').value > 0)
      .map((p: AbstractControl): ProductResume => {
        return {
          id: p.get('id').value,
          code: p.get('code').value,
          ean: p.get('ean').value,
          name: p.get('name').value,
          amount: p.get('amount').value,
          pvp: p.get('pvp').value,
          type: p.get('type').value,
          chargeableOutBudgetSelected: p.get('chargeableOutBudgetSelected').value,
        };
      });
  }

  async generateInvoice(): Promise<void> {
    if (this.invoice) {
      window.open('invoice/' + this.invoice._id);
      return;
    }
    this.generatingInvoice = true;
    this.firstStepControl.get('familySearched').setValue(false);
    this.secondStepControl.get('productsAdded').setValue(false);
    setTimeout(async () => {
      this.invoice = await this.service.createInvoice(this.family, this.productsInvoice);
      window.open('invoice/' + this.invoice._id);
      this.generatingInvoice = false;
    }, 500);
  }

  toggleRelatedInvoiceRestrictions(i: number, id: string): void {
    if (this.enabledRelatedInvoices[id]) {
      this.family.limit = Number((this.family.limit + this.enabledRelatedInvoices[id].pvp).toFixed(2));
      delete this.enabledRelatedInvoices[id];
    } else {
      this.enabledRelatedInvoices[id] = this.familyRelatedInvoices[i];
      this.family.limit = Number((this.family.limit - this.enabledRelatedInvoices[id].pvp).toFixed(2));
    }
    // falsy AbstractControl made to just call the modify with 0 amount and an empty control.
    const falsyAbstractControl = {
      value: 0,
      setValue: () => {}
    };
    this.modifyProductAmount(falsyAbstractControl as any, 0);
  }
}
