import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InvoiceWsService, WsMessage, WsTopics } from '../../../services/ws/invoice-ws.service';
import { DashboardCommunicationService } from '../../services/dashboard-communication/dashboard-communication.service';
import { InvoiceDto, ProductResume, ReceptionService } from '../../services/reception/reception.service';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css'],
})
export class WarehouseComponent implements OnInit, OnDestroy {
  invoiceSubscription: Subscription;
  socketReconnectSubscription: Subscription;
  orders: InvoiceDto[] = [];
  ordersDispatched: InvoiceDto[] = [];
  loading = true;
  dateFormatTable = 'dd/MM/y';
  dispatching: string;
  dispatchingProducts: ProductResume[];
  dispatchingChecked = 0;

  constructor(
    private invoicesWs: InvoiceWsService,
    private receptionService: ReceptionService,
    private communicationService: DashboardCommunicationService,
  ) { }

  ngOnInit(): void {
    this.socketReconnectSubscription = this.invoicesWs.socketReconnected.subscribe(() => {
      this.searchToday();
    });
    this.invoiceSubscription = this.invoicesWs.invoiceSubscription.subscribe((message: WsMessage) => {
      if (message.event === WsTopics.INVOICES) {
        this.searchToday();
      }
    });
    this.searchToday();
  }

  ngOnDestroy(): void {
    if (this.invoiceSubscription) {
      this.invoiceSubscription.unsubscribe();
    }
    if (this.socketReconnectSubscription) {
      this.socketReconnectSubscription.unsubscribe();
    }
  }

  startDispatch(id: string): void {
    const order = this.orders.find((o: InvoiceDto) => id === o._id);
    if (!order) {
      this.communicationService.snackBarEmitMessage('Error accediendo al pedido seleccionado');
      return;
    }
    this.dispatchingProducts = order.products;
    this.dispatching = id;
  }

  checkedProduct(change: { checked: boolean }): void {
    this.dispatchingChecked += (change.checked ? 1 : -1);
  }

  async sendDispatch(): Promise<void> {
    this.loading = true;
    this.dispatchingChecked = 0;
    await this.receptionService.dispatchOrderById(this.dispatching);
    this.communicationService.snackBarEmitMessage('Pedido despachado correctamente');
    this.stopDispatch();
    this.searchToday();
  }

  stopDispatch(): void {
    this.dispatchingChecked = 0;
    this.dispatchingProducts = null;
    this.dispatching = null;
  }

  searchToday(): void {
    this.loading = true;
    setTimeout(() => {
      this.receptionService.getTodayInvoices().then((data: InvoiceDto[]) => {
        this.sliceData(data);
        this.loading = false;
      });
    }, 500);
  }

  sliceData(data: InvoiceDto[]): void {
    this.orders = data.filter((d) => !d.dispatched);
    this.orders.forEach((order: InvoiceDto) => {
      order.sumTotalProducts = 0;
      order.products.forEach((p: ProductResume) => {
        order.sumTotalProducts += p.amount;
      });
    });
    this.ordersDispatched = data.filter((d) => d.dispatched);
    this.ordersDispatched.forEach((order: InvoiceDto) => {
      order.sumTotalProducts = 0;
      order.products.forEach((p: ProductResume) => {
        order.sumTotalProducts += p.amount;
      });
    });
  }
}
