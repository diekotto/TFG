import { Component, OnInit } from '@angular/core';
import { DashboardCommunicationService } from '../../services/dashboard-communication/dashboard-communication.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(
    private communication: DashboardCommunicationService
  ) { }

  ngOnInit(): void {
  }

  emitMessageToParent(message: string): void {
    this.communication.snackBarEmitMessage(message);
  }
}
