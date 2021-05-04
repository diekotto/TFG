import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user/user.service';
import { InvoiceWsService, WsMessage, WsTopics } from '../../../services/ws/invoice-ws.service';
import { InvoiceDto, ReceptionService } from '../../services/reception/reception.service';

@Component({
  selector: 'app-cash',
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.css'],
})
export class CashComponent implements OnInit, OnDestroy {
  invoiceSubscription: Subscription;
  socketReconnectSubscription: Subscription;
  myForm: FormGroup;
  invoices: InvoiceDto[] = [];
  invoicesPaid: InvoiceDto[] = [];
  invoicesClosed: InvoiceDto[] = [];
  invoicesPaying: { [index: string]: boolean } = {};
  invoicesClosing: { [index: string]: boolean } = {};
  invoicesResume: InvoiceResume[] = this.initialInvoicesResume();
  loading = true;
  showingRange = false;
  dateFormatTable = 'dd/MM/y';
  anonymizing = false;
  anonymizeLoading = false;

  constructor(
    private invoicesWs: InvoiceWsService,
    private receptionService: ReceptionService,
    private fb: FormBuilder,
    public userService: UserService,
  ) { }

  ngOnInit(): void {
    this.socketReconnectSubscription = this.invoicesWs.socketReconnected.subscribe(() => {
      this.searchByDateRange(true);
    });
    this.invoiceSubscription = this.invoicesWs.invoiceSubscription.subscribe((message: WsMessage) => {
      if (message.event === WsTopics.INVOICES) {
        this.searchByDateRange(true);
      }
    });
    this.myForm = this.fb.group({
      from: [new Date(), Validators.required],
      to: [new Date(), Validators.required],
    });
    this.searchByDateRange(true);
  }

  ngOnDestroy(): void {
    if (this.invoiceSubscription) {
      this.invoiceSubscription.unsubscribe();
    }
    if (this.socketReconnectSubscription) {
      this.socketReconnectSubscription.unsubscribe();
    }
  }

  toggleClickPreparePaying(id: string): void {
    if (this.invoicesPaying[id]) {
      delete this.invoicesPaying[id];
      return;
    }
    this.invoicesPaying = {};
    this.invoicesPaying[id] = true;
  }

  toggleClickPrepareClosing(id: string): void {
    if (this.invoicesClosing[id]) {
      delete this.invoicesClosing[id];
      return;
    }
    this.invoicesClosing = {};
    this.invoicesClosing[id] = true;
  }

  async clickPayOrClose(id: string): Promise<void> {
    if (this.invoicesPaying[id]) {
      await this.receptionService.payInvoiceById(id);
    }
    if (this.invoicesClosing[id]) {
      await this.receptionService.closeInvoiceById(id);
    }
    this.invoicesClosing = {};
    this.invoicesPaying = {};
    this.loading = true;
  }

  cancelPayOrClose(): void {
    this.invoicesPaying = {};
    this.invoicesClosing = {};
  }

  searchByDateRange(force = false): void {
    if (this.loading && !force) {
      return;
    }
    this.loading = true;
    const from: number = this.myForm.get('from').value.getTime();
    const to: number = this.myForm.get('to').value.getTime();
    this.showingRange = from !== to;
    setTimeout(() => {
      this.receptionService.getRangeInvoices(from, to).then((data: InvoiceDto[]) => {
        this.sliceData(data);
        this.loading = false;
      });
    }, 500);
  }

  initialInvoicesResume(): InvoiceResume[] {
    return [
      {
        icon: InvoiceResumeIcon.OPEN,
        type: InvoiceResumeType.OPEN,
        count: 0,
        hasSpecial: false,
        total: 0,
        totalWithoutSpecials: 0,
      },
      {
        icon: InvoiceResumeIcon.PAID,
        type: InvoiceResumeType.PAID,
        count: 0,
        hasSpecial: false,
        total: 0,
        totalWithoutSpecials: 0,
      },
      {
        icon: InvoiceResumeIcon.CLOSED,
        type: InvoiceResumeType.CLOSED,
        count: 0,
        hasSpecial: false,
        total: 0,
        totalWithoutSpecials: 0,
      },
    ];
  }

  sliceData(data: InvoiceDto[]): void {
    const resume: InvoiceResume[] = this.initialInvoicesResume();
    this.invoices = data.filter((d) => !d.paid && !d.deleted);
    resume[0] = {
      icon: InvoiceResumeIcon.OPEN,
      type: InvoiceResumeType.OPEN,
      count: this.invoices.length,
      hasSpecial: this.invoices.reduce((p, c) => p + +c.special, 0) > 0,
      total: this.invoices.reduce((p, c) => p + c.pvp, 0),
      totalWithoutSpecials: this.invoices.reduce((p, c) => p + (c.special ? 0 : c.pvp), 0),
    };
    this.invoicesPaid = data.filter((d) => d.paid);
    resume[1] = {
      icon: InvoiceResumeIcon.PAID,
      type: InvoiceResumeType.PAID,
      count: this.invoicesPaid.length,
      hasSpecial: this.invoicesPaid.reduce((p, c) => p + +c.special, 0) > 0,
      total: this.invoicesPaid.reduce((p, c) => p + c.pvp, 0),
      totalWithoutSpecials: this.invoicesPaid.reduce((p, c) => p + (c.special ? 0 : c.pvp), 0),

    };
    this.invoicesClosed = data.filter((d) => d.deleted);
    resume[2] = {
      icon: InvoiceResumeIcon.CLOSED,
      type: InvoiceResumeType.CLOSED,
      count: this.invoicesClosed.length,
      hasSpecial: this.invoicesClosed.reduce((p, c) => p + +c.special, 0) > 0,
      total: this.invoicesClosed.reduce((p, c) => p + c.pvp, 0),
      totalWithoutSpecials: this.invoicesClosed.reduce((p, c) => p + (c.special ? 0 : c.pvp), 0),
    };
    this.invoicesResume = [...resume];
  }

  toggleAnonymize(): void {
    this.anonymizing = !this.anonymizing;
  }

  anonymizeByDateRange(): void {
    this.anonymizeLoading = true;
    this.loading = true;
    const from: number = this.myForm.get('from').value.getTime();
    const to: number = this.myForm.get('to').value.getTime();
    this.showingRange = from !== to;
    setTimeout(() => {
      this.receptionService.anonymizeRangeInvoices(from, to).then((anonymized: number) => {
        console.log('Anonymized: ', anonymized);
        this.anonymizeLoading = this.loading = this.anonymizing = false;
      });
    }, 500);
  }
}

interface InvoiceResume {
  icon: InvoiceResumeIcon;
  type: InvoiceResumeType;
  count: number;
  hasSpecial: boolean;
  total: number;
  totalWithoutSpecials: number;
}

enum InvoiceResumeType {
  OPEN = 'Abiertas',
  PAID = 'Pagadas',
  CLOSED = 'Cerradas',
}

enum InvoiceResumeIcon {
  OPEN = 'style',
  PAID = 'attach_money',
  CLOSED = 'close',
  PRINT = 'print',
}
