import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { InvoiceWsService, WsMessage, WsTopics } from '../../../services/ws/invoice-ws.service';
import { DashboardCommunicationService } from '../../services/dashboard-communication/dashboard-communication.service';
import { InvoiceDto, ReceptionService } from '../../services/reception/reception.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, OnDestroy {
  invoiceSubscription: Subscription;
  socketReconnectSubscription: Subscription;
  loading = true;
  dateFormat = 'dd/MM/y';
  cardDataToday: CardDataToday = {
    date: new Date().toISOString(),
    amountProducts: 0,
    familiesAttended: 0,
    totalInvoices: 0,
  };
  cardDataSpecial: CardDataSpecial = {
    totalFamilies: 0,
    specialFamilies: 0,
    ratio: 0,
  };
  cardDataLastInvoices: InvoiceDto[] = [];
  cardDataFamiliesChartColors: Color[] = [
    {
      backgroundColor: '#fda651',
      pointRadius: 5,
      pointHoverRadius: 10,
    },
  ];
  cardDataFamiliesChart: CardDataChartDataSet = {
    barChartOptions: {
      responsive: true,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              stepSize: 1,
            },
          },
        ],
      },
    },
    labels: [],
    legend: true,
    charType: 'line',
    dataset: [{
      data: [],
      label: 'Familias',
      lineTension: 0.3,
    }],
  };
  cardDataCashChartColors: Color[] = [
    { backgroundColor: '#fda651' },
  ];
  cardDataCashChart: CardDataChartDataSet = {
    barChartOptions: {
      responsive: true,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              stepSize: 20,
            },
          },
        ],
      },
    },
    labels: [],
    legend: true,
    charType: 'bar',
    dataset: [{ data: [], label: '€' }],
  };
  cardDataFavProductsColor = ['#DAD870', '#FFCD58', '#FF9636', '#FF5C4D', '#D3D3CB'];
  cardDataFavProductsChart: CardDataChartDataSet = {
    barChartOptions: {
      responsive: true,
      cutoutPercentage: 35,
    },
    labels: [],
    legend: true,
    charType: 'doughnut',
    dataset: [{
      data: [],
      label: '€',
      backgroundColor: this.cardDataFavProductsColor,
    }],
  };

  constructor(
    private invoicesWs: InvoiceWsService,
    private receptionService: ReceptionService,
    private communication: DashboardCommunicationService,
  ) { }

  ngOnInit(): void {
    this.socketReconnectSubscription = this.invoicesWs.socketReconnected.subscribe(() => {
      this.loadGeneralData();
    });
    this.invoiceSubscription = this.invoicesWs.invoiceSubscription.subscribe((message: WsMessage) => {
      if (message.event === WsTopics.INVOICES) {
        this.loadGeneralData();
      }
    });
    this.loadGeneralData();
  }

  ngOnDestroy(): void {
    if (this.invoiceSubscription) {
      this.invoiceSubscription.unsubscribe();
    }
    if (this.socketReconnectSubscription) {
      this.socketReconnectSubscription.unsubscribe();
    }
  }

  emitMessageToParent(message: string): void {
    this.communication.snackBarEmitMessage(message);
  }

  loadGeneralData(): void {
    this.loading = true;
    Promise.all([this.searchInvoicesToday(), this.searchAllInvoices()])
      .then(() => {
        this.loading = false;
      });
  }

  searchInvoicesToday(): Promise<void> {
    return this.receptionService.getTodayInvoices().then((data: InvoiceDto[]) => {
      this.sliceTodayData(data);
      this.loading = false;
    });
  }

  searchAllInvoices(): Promise<void> {
    return this.receptionService
      .getRangeInvoices(
        new Date(null).getTime(),
        new Date().getTime())
      .then((data: InvoiceDto[]) => {
        this.sliceAllData(data);
        this.loading = false;
      });
  }

  sliceTodayData(input: InvoiceDto[]): void {
    const data = input.filter((d) => !d.deleted);
    this.cardDataToday.totalInvoices = data.reduce((p, c) => p + c.pvp, 0);
    this.cardDataToday.amountProducts = 0;
    data.forEach((d) => {
      this.cardDataToday.amountProducts += d.products.reduce((p, c) => p + c.amount, 0);
    });
    this.cardDataToday.familiesAttended = data.length;

    this.cardDataLastInvoices = this.sortDataCreatedDesc(data).slice(0, 5);
  }

  sliceAllData(input: InvoiceDto[]): void {
    const data = input.filter((d) => !d.deleted).map((d) => (
      { ...d, createdAt: formatDate(d.createdAt, this.dateFormat, 'es') }
    ));
    this.cardDataSpecial.totalFamilies = data.length;
    this.cardDataSpecial.specialFamilies = data.filter((d) => d.special).length;
    this.cardDataSpecial.ratio = this.cardDataSpecial.specialFamilies / this.cardDataSpecial.totalFamilies * 100;

    const sortedData = this.sortDataCreatedDesc(data);
    this.dataLoadFamiliesChart(sortedData);
    this.dataLoadCashChart(sortedData);
    this.dataLoadFavProductsPie(sortedData);
  }

  sortDataCreatedDesc(data: InvoiceDto[]): InvoiceDto[] {
    return data
      .filter((d) => !d.deleted)
      .sort((a: InvoiceDto, b: InvoiceDto) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        }
        if (a.createdAt < b.createdAt) {
          return 1;
        }
        return 0;
      });
  }

  dataLoadFamiliesChart(sortedData: InvoiceDto[]): void {
    this.cardDataFamiliesChart.labels = [];
    this.cardDataFamiliesChart.dataset[0].data = [];
    const lastDays: CardDataChartData[] = [];
    let currentDay: CardDataChartData;
    for (const s of sortedData) {
      if (lastDays.length >= 10) {
        break;
      }
      if (!currentDay) {
        currentDay = {
          date: s.createdAt,
          total: 1,
        };
        continue;
      }
      if (s.createdAt !== currentDay.date) {
        lastDays.push(currentDay);
        currentDay = {
          date: s.createdAt,
          total: 1,
        };
        continue;
      }
      currentDay.total += 1;
    }
    lastDays.push(currentDay);
    lastDays[0].date = 'Hoy';
    console.log('lastDays: ', lastDays);
    lastDays.reverse().forEach((l) => {
      this.cardDataFamiliesChart.labels.push(l.date);
      this.cardDataFamiliesChart.dataset[0].data.push(l.total);
    });
  }

  dataLoadCashChart(sortedData: InvoiceDto[]): void {
    this.cardDataCashChart.labels = [];
    this.cardDataCashChart.dataset[0].data = [];
    const lastDays: CardDataChartData[] = [];
    let currentDay: CardDataChartData;
    for (const s of sortedData) {
      if (lastDays.length >= 5) {
        break;
      }
      if (!currentDay) {
        currentDay = {
          date: s.createdAt,
          total: s.pvp,
        };
        continue;
      }
      if (s.createdAt !== currentDay.date) {
        lastDays.push(currentDay);
        currentDay = {
          date: s.createdAt,
          total: s.pvp,
        };
        continue;
      }
      currentDay.total += Number(s.pvp.toFixed(2));
    }
    lastDays.push(currentDay);
    lastDays[0].date = 'Hoy';
    console.log('lastDays: ', lastDays);
    lastDays.reverse().forEach((l) => {
      this.cardDataCashChart.labels.push(l.date);
      this.cardDataCashChart.dataset[0].data.push(Number(l.total.toFixed(2)));
    });
  }

  dataLoadFavProductsPie(sortedData: InvoiceDto[]): void {
    this.cardDataFavProductsChart.labels = [];
    this.cardDataFavProductsChart.dataset[0].data = [];
    const favCount: { [index: string]: number } = {};
    sortedData.forEach((d) => {
      d.products.forEach((p) => {
        favCount[p.name] = (favCount[p.name] || 0) + p.amount;
      });
    });
    const sortedFavProducts = Object.keys(favCount).sort((a: string, b: string) => {
      if (favCount[a] > favCount[b]) {
        return -1;
      }
      if (favCount[a] < favCount[b]) {
        return 1;
      }
      return 0;
    });
    const favSliced = sortedFavProducts.slice(0, 5);
    this.cardDataFavProductsChart.labels = favSliced;
    this.cardDataFavProductsChart.dataset[0].data = favSliced.map((name) => favCount[name]);
  }
}

interface CardDataToday {
  date: string;
  familiesAttended: number;
  amountProducts: number;
  totalInvoices: number;
}

interface CardDataSpecial {
  totalFamilies: number;
  specialFamilies: number;
  ratio: number;
}

interface CardDataChartDataSet {
  barChartOptions: ChartOptions;
  labels: Label[];
  legend: boolean;
  charType: ChartType;
  dataset: ChartDataSets[];
}

interface CardDataChartData {
  date: string;
  total: number;
}
