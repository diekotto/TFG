import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PingService } from '../ping/ping.service';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

  private socket: WebSocket;
  readonly invoiceSubscription = new EventEmitter<WsMessage>();

  constructor(private pingService: PingService) {
    this.pingService.onPing.subscribe((alive: boolean) => {
      if (alive && this.socket.CLOSED) {
        this.initSocket();
      }
    });
    this.initSocket();
  }

  private initSocket(): void {
    // TODO: Habría que generalizarlo en caso de tener más servicios de ws
    this.socket = new WebSocket(environment.backendWs);
    this.socket.onopen = () => {
      console.log('WS connected');
      this.socket.onmessage = (message: MessageEvent) => {
        console.log(message.data);
        let data;
        try {
          data = JSON.parse(message.data);
        } catch (err) {
          data = message.data;
        }
        this.invoiceSubscription.emit(data);
      };
    };
    this.socket.onclose = () => {
      console.log('El websocket se ha cerrado');
      this.pingService.pingAndManage();
    };
  }

  sendInvoiceMessage(data: InvoiceMessage): void {
    const message = JSON.stringify({
      event: 'invoices',
      data,
    });
    console.log('Sending: ', message);
    this.socket.send(message);
  }
}

export interface WsMessage {
  event: string;
  data: InvoiceMessage;
}

export interface InvoiceMessage {
  invoiceId: string;
  action: ResolveInvoiceAction;
}

export enum ResolveInvoiceAction {
  CLOSE,
  PAY,
}
