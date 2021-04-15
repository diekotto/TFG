import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { ProductService } from '../dashboard/services/product/product.service';
import { InvoiceDto } from '../dashboard/services/reception/reception.service';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  id: string;
  code = '';
  invoice: InvoiceDto;
  loading = true;
  emitted: Date;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private userService: UserService,
    public productService: ProductService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.fetchInvoice(this.id).then((invoice: InvoiceDto) => {
        this.invoice = invoice;
        this.code = invoice.code;
        this.emitted = new Date(invoice.createdAt);
        this.loading = false;
      });
    });
  }

  fetchInvoice(id: string): Promise<InvoiceDto> {
    return this.http.get<InvoiceDto>(environment.backend + '/invoice/' + id, {
      headers: {
        Authorization: `Bearer ${this.userService.jwt}`
      },
    }).toPromise()
      .then((data: any) => {
        return Promise.resolve(data);
      })
      .catch(err => this.userService.logoutHttp401(err) as any);
  }

  formatNumber(input: number): string {
    return input.toFixed(2);
  }

  firstLetterUpperCase(input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }
}
