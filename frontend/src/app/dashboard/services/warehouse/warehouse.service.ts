import { Injectable } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {

  private warehouses: Warehouse[];

  constructor(
    private userService: UserService,
    private http: HttpClient,
  ) { }

  async readById(id: string): Promise<Warehouse> {
    return this.http.get<Warehouse>(`${environment.backend}/warehouse/${id}`, {
      headers: {
        Authorization: `Bearer ${this.userService.jwt}`,
      },
    }).toPromise()
      .then((data: Warehouse) => data)
      .catch(err => this.userService.logoutHttp401(err) as any);
  }

  async fetchAll(): Promise<Warehouse[]> {
    return this.http.get(environment.backend + '/warehouse', {
      headers: {
        Authorization: `Bearer ${this.userService.jwt}`,
      },
    }).toPromise()
      .then((data: any) => {
        this.warehouses = data;
        return Promise.resolve(data);
      })
      .catch(err => this.userService.logoutHttp401(err) as any);
  }

  getAll(): Warehouse[] {
    return this.warehouses;
  }

  async create(warehouse: { name: string, headquarter: string }): Promise<Warehouse> {
    return this.http.post<Warehouse>(`${environment.backend}/warehouse`,
      warehouse,
      {
        headers: {
          Authorization: `Bearer ${this.userService.jwt}`,
        },
      }).toPromise()
      .then((data: Warehouse) => data)
      .catch(err => this.userService.logoutHttp401(err) as any);
  }

  async update(id: string, warehouse: { name: string }): Promise<Warehouse> {
    return this.http.put<Warehouse>(`${environment.backend}/warehouse/${id}`,
      { id, ...warehouse },
      {
        headers: {
          Authorization: `Bearer ${this.userService.jwt}`,
        },
      }).toPromise()
      .then((data: Warehouse) => data)
      .catch(err => this.userService.logoutHttp401(err) as any);
  }

}


export enum WarehouseProductPreference {
  LOW,
  MEDIUM,
  HIGH,
}

export interface WarehouseMetadata {
  id: string; // UID
  product: string;
  preference: WarehouseProductPreference;
  stock: number;
  blocked: boolean;
}

export interface WarehouseProduct {
  id: string; // UID
  product: string; // Product document id
  expiry: Date;
}

export interface Warehouse {
  id: string;
  name: string;
  headquarter: string;
  createdAt: Date;
  products: WarehouseProduct[];
  metadata: WarehouseMetadata[];
}
