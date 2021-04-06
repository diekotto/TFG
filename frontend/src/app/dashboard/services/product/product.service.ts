import { Injectable, EventEmitter } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Product[] = [];
  private openfoodProduct: Product;

  openfoodEmitter = new EventEmitter<Product>();

  constructor(
    private userService: UserService,
    private http: HttpClient
  ) { }

  async fetchAll(): Promise<Product[]> {
    return this.http.get(environment.backend + '/product', {
      headers: {
        Authorization: `Bearer ${this.userService.jwt}`
      },
    }).toPromise()
      .then((data: any) => {
        this.products = data;
        return Promise.resolve(data);
      });
  }

  async fetchByEan(ean: string): Promise<Product> {
    return this.http.get(environment.backend + '/product/' + ean, {
      headers: {
        Authorization: `Bearer ${this.userService.jwt}`
      },
    }).toPromise()
      .then((data: any) => {
        this.openfoodProduct = data;
        this.openfoodEmitter.emit(data);
        return Promise.resolve(data);
      });
  }

  getAll(): Product[] {
    return this.products;
  }

  create(product: Product): void {
    throw new Error('Not implemented yet');
  }
}

export interface Product {
  id: string;
  name: string;
  quantity: string; // peso o unidades
  categories: string;
  ingredients: string;
  allergens: string;
  labels: string;
  imageUrl: string;
  limits: ProductLimits[];
  pvp: number;
  code: string; // Inner code for every warehouse
  warehouse: string;
}

export interface ProductLimits {
  price: number;
  quantity: number;
}
