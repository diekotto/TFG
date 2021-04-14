import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InvoicesService, WsMessage } from '../../../services/ws/invoices.service';

@Component({
  selector: 'app-cash',
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.css']
})
export class CashComponent implements OnInit, OnDestroy {

  invoiceSubscription: Subscription;
  messages: WsMessage[] = [];
  myForm: FormGroup;

  constructor(
    private invoicesWs: InvoicesService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.invoiceSubscription = this.invoicesWs.invoiceSubscription.subscribe((message: WsMessage) => {
      this.messages.push(message);
    });
    this.myForm = this.fb.group({
      invoiceId: [''],
      action: [0]
    });
  }

  ngOnDestroy(): void {
    if (this.invoiceSubscription) {
      this.invoiceSubscription.unsubscribe();
    }
  }

  sendMessage(): void {
    this.invoicesWs.sendInvoiceMessage(this.myForm.value);
  }
}
