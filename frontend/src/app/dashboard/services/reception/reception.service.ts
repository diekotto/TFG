import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../../services/user/user.service';
import { ProductType } from '../product/product.service';

@Injectable({
  providedIn: 'root',
})
export class ReceptionService {

  constructor(
    private userService: UserService,
    private http: HttpClient,
  ) { }

  createInvoice(family: FamilyResume, products: ProductResume[]): any {
    const body: InvoiceDto = {
      familyName: family.name,
      credential: family.credential,
      expedient: family.expedient,
      special: family.special,
      products,
      pvp: products.reduce((prev: number, cur: ProductResume) => prev + (cur.pvp * cur.amount), 0),
    };
    body.pvp = Number(body.pvp.toFixed(2));
    return this.http.post<InvoiceDto>(`${environment.backend}/invoice`,
      body,
      {
        headers: {
          Authorization: `Bearer ${this.userService.jwt}`,
        },
      }).toPromise()
      .then((response) => response)
      .catch(err => this.userService.logoutHttp401(err) as any);
  }

  findFamilyCurrentMonth(credential: string, expedient: string): Promise<InvoiceDto[]> {
    return this.http.get<InvoiceDto[]>(`${environment.backend}/invoice/credential/${credential}/expedient/${expedient}`, {
      headers: {
        Authorization: `Bearer ${this.userService.jwt}`,
      },
    }).toPromise()
      .then((response) => response)
      .catch(err => this.userService.logoutHttp401(err) as any);
  }

  getTodayInvoices(): Promise<InvoiceDto[]> {
    return this.http.get<InvoiceDto[]>(`${environment.backend}/invoice/today`, {
      headers: {
        Authorization: `Bearer ${this.userService.jwt}`,
      },
    }).toPromise()
      .then((response) => response)
      .catch(err => this.userService.logoutHttp401(err) as any);
  }

  getRangeInvoices(from: number, to: number): Promise<any> {
    return this.http.get<InvoiceDto[]>(`${environment.backend}/invoice/from/${from}/to/${to}`, {
      headers: {
        Authorization: `Bearer ${this.userService.jwt}`,
      },
    }).toPromise()
      .then((response) => response)
      .catch(err => this.userService.logoutHttp401(err) as any);
  }

  payInvoiceById(id: string): Promise<void> {
    return this.http.put<void>(`${environment.backend}/invoice/${id}/pay`, {}, {
      headers: {
        Authorization: `Bearer ${this.userService.jwt}`,
      },
    }).toPromise()
      .then((response) => response)
      .catch(err => this.userService.logoutHttp401(err) as any);
  }

  closeInvoiceById(id: string): Promise<void> {
    return this.http.put<void>(`${environment.backend}/invoice/${id}/close`, {}, {
      headers: {
        Authorization: `Bearer ${this.userService.jwt}`,
      },
    }).toPromise()
      .then((response) => response)
      .catch(err => this.userService.logoutHttp401(err) as any);
  }

  dispatchOrderById(id: string): Promise<void> {
    return this.http.put<void>(`${environment.backend}/invoice/${id}/dispatch`, {}, {
      headers: {
        Authorization: `Bearer ${this.userService.jwt}`,
      },
    }).toPromise()
      .then((response) => response)
      .catch(err => this.userService.logoutHttp401(err) as any);
  }
}

export interface FamilyResume {
  name: string;
  expedient: string;
  credential: string;
  special: boolean;
  visits: number;
  limit: number;
  originalLimit: number;
}

export interface ProductResume {
  id: string;
  ean: string;
  code: string;
  name: string;
  amount: number;
  pvp: number;
  type: ProductType;
  chargeableOutBudgetSelected: boolean;
}

export interface InvoiceDto {
  _id?: string;
  code?: string; // Code for easy human identification
  headquarter?: string; // foreign key headquarter collection
  familyName: string;
  expedient: string;
  credential: string;
  special: boolean;
  products: ProductResume[]; // list of ean products
  sumTotalProducts?: number; // Only used and generated in warehouse
  pvp: number;
  createdAt?: string;
  updatedAt?: string;
  paid?: boolean;
  deleted?: boolean;
  origin?: string; // USER ID
  resolver?: string; // USER ID
  resolvedAt?: string;
  dispatcher?: string; // USER ID
  dispatched?: boolean;
  dispatchedAt?: string;
}
