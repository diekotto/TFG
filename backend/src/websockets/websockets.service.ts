import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../config/configuration';
import Server from 'ws';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ResolveInvoiceAction } from '../api/invoice/invoice.service';
import { Socket } from 'socket.io';

export enum WsTopics {
  INVOICES = 'invoices',
  UNKNOWN = 'unknown',
}

@Injectable()
@WebSocketGateway()
export class WebsocketsService
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private wsClients: any[] = [];

  constructor(private config: ConfigService<AppConfig>) {}

  @SubscribeMessage(WsTopics.INVOICES)
  handleInvoiceMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log(data, typeof data);
    this.broadcast(
      {
        event: WsTopics.INVOICES,
        data,
      },
      client,
    );
  }

  handleConnection(client: any): void {
    this.wsClients.push(client);
  }

  handleDisconnect(client): void {
    const i = this.wsClients.findIndex((c) => c === client);
    if (i > -1) {
      this.wsClients.splice(i, 1);
    }
  }

  broadcast(message: WsMessage | string, sender: Socket): void {
    const payload: WsMessage = {
      event: WsTopics.UNKNOWN,
      data: '',
    };
    if (typeof message === 'string') {
      payload.data = message;
    } else {
      payload.event = message.event;
      payload.data = message.data;
    }
    for (const c of this.wsClients) {
      if (c.id === sender.id) {
        return;
      }
      c.send(JSON.stringify(payload));
    }
  }

  broadcastInvoice(message: InvoiceMessage): void {
    const data: WsInvoiceMessage = {
      event: WsTopics.INVOICES,
      data: message,
    };
    this.broadcast(data, { id: null } as Socket);
  }
}

interface WsMessage {
  event: WsTopics;
  data: any;
}

export interface WsInvoiceMessage {
  event: WsTopics;
  data: InvoiceMessage;
}

export interface InvoiceMessage {
  invoiceId: string;
  action: ResolveInvoiceAction;
}
