import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PingService } from '../ping/ping.service';

@Injectable({
  providedIn: 'root',
})
export class InvoiceWsService {

  static socket: WebSocket;
  readonly invoiceSubscription = new EventEmitter<WsMessage>();
  readonly socketReconnected = new EventEmitter<void>();
  private connectionClosed = true;

  constructor(private pingService: PingService) {
    this.initSocket();
    this.pingService.onPing.subscribe((alive: boolean) => {
      if (alive) {
        this.initSocket();
      }
    });
  }

  private initSocket(): void {
    if (!this.connectionClosed) {
      return;
    }
    this.connectionClosed = false;
    // TODO: Habría que generalizarlo en caso de tener más servicios de ws
    InvoiceWsService.socket = new WebSocket(environment.backendWs);
    InvoiceWsService.socket.onopen = () => {
      console.log('WS connected');
      InvoiceWsService.socket.onmessage = (message: MessageEvent) => {
        console.log(message.data);
        let data;
        try {
          data = JSON.parse(message.data);
        } catch (err) {
          data = message.data;
        }
        this.invoiceSubscription.emit(data);
      };
      InvoiceWsService.socket.onclose = () => {
        console.log('El websocket se ha cerrado');
        this.connectionClosed = true;
        this.pingService.pingAndManage();
        this.socketReconnected.emit();
      };
    };
  }

  sendInvoiceMessage(data: InvoiceMessage): void {
    const message = JSON.stringify({
      event: 'invoices',
      data,
    });
    console.log('Sending: ', message);
    InvoiceWsService.socket.send(message);
  }
}

export enum WsTopics {
  INVOICES = 'invoices',
  UNKNOWN = 'unknown',
}

export interface WsMessage {
  event: WsTopics;
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
