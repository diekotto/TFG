import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PingService {
  private static timer: number;
  private backendStatus = false;
  private count = 0;

  onPing = new EventEmitter<boolean>();

  constructor(private http: HttpClient) {
    if (!PingService.timer) {
      this.ping()
        .then((pinged: boolean) => {
          this.onPing.emit(pinged);
          this.backendStatus = pinged;
          this.initTimeout();
        });
    }
  }

  get pingCount(): number {
    return this.count;
  }

  get alive(): boolean {
    return this.backendStatus;
  }

  private initTimeout(): void {
    if (PingService.timer) {
      return;
    }
    PingService.timer = setTimeout(() => {
      this.ping().then((pinged: boolean) => {
        this.onPing.emit(pinged);
        this.backendStatus = pinged;
        this.initTimeout();
        PingService.timer = null;
      });
    }, 60000);
  }

  private async ping(): Promise<boolean> {
    console.log('Ping backend...');
    return new Promise((resolve) => {
      this.count++;
      this.http.get(environment.backend + '/alive').toPromise()
        .then(() => {
          console.log('Ping: ', true);
          resolve(true);
        })
        .catch((err) => {
          console.log(err);
          resolve(false);
        });
    });
  }
}
