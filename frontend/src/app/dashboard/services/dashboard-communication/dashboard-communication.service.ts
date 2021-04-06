import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardCommunicationService {
  private snackBarEmitter = new EventEmitter<string>();

  constructor() { }

  onSnackBarMessage(cb: any): Subscription {
    return this.snackBarEmitter.subscribe(cb);
  }

  snackBarEmitMessage(message: string): void {
    this.snackBarEmitter.emit(message);
  }
}
