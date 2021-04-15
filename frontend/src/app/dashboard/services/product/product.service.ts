import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../../services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private products: Product[] = [];
  private openFoodProduct: Product;

  constructor(
    private userService: UserService,
    private http: HttpClient,
  ) { }

  async fetchAll(): Promise<Product[]> {
    return this.http.get(environment.backend + '/product', {
      headers: {
        Authorization: `Bearer ${this.userService.jwt}`,
      },
    }).toPromise()
      .then((data: any) => {
        this.products = data;
        return Promise.resolve(data);
      })
      .catch(err => this.userService.logoutHttp401(err) as any);
  }

  async fetchByEan(ean: string): Promise<Product> {
    return this.http.get(environment.backend + '/product/ean/' + ean, {
      headers: {
        Authorization: `Bearer ${this.userService.jwt}`,
      },
    }).toPromise()
      .then((data: any) => {
        this.openFoodProduct = data;
        return Promise.resolve(data);
      })
      .catch(err => this.userService.logoutHttp401(err) as any);
  }

  async fetchById(id: string): Promise<Product> {
    return this.http.get<Product>(environment.backend + '/product/' + id, {
      headers: {
        Authorization: `Bearer ${this.userService.jwt}`,
      },
    }).toPromise()
      .then((response) => response)
      .catch(err => this.userService.logoutHttp401(err) as any);
  }

  async create(input: any): Promise<Product> {
    const product: CreateProductResponseDto = {
      ean: input.ean,
      alias: input.name,
      code: input.code,
      pvp: input.price,
      type: input.type,
      chargeableOutBudget: input.chargeableOutBudget,
      limits: [
        { price: 10, quantity: input.limit10e },
        { price: 13, quantity: input.limit13e },
        { price: 17, quantity: input.limit17e },
        { price: 22, quantity: input.limit22e },
        { price: 27, quantity: input.limit27e },
        { price: 32, quantity: input.limit32e },
      ],
    };
    return this.http.post(environment.backend + '/product',
      product,
      {
        headers: {
          Authorization: `Bearer ${this.userService.jwt}`,
        },
      }).toPromise()
      .then((data: any) => {
        return Promise.resolve(data);
      })
      .catch(err => this.userService.logoutHttp401(err) as any);
  }

  async updateById(input: any): Promise<Product> {
    const product: CreateProductResponseDto = {
      ean: input.ean,
      alias: input.name,
      code: input.code,
      pvp: input.price,
      type: input.type,
      chargeableOutBudget: input.chargeableOutBudget,
      limits: [
        { price: 10, quantity: input.limit10e },
        { price: 13, quantity: input.limit13e },
        { price: 17, quantity: input.limit17e },
        { price: 22, quantity: input.limit22e },
        { price: 27, quantity: input.limit27e },
        { price: 32, quantity: input.limit32e },
      ],
    };
    return this.http.put(environment.backend + '/product/' + input._id,
      product,
      {
        headers: {
          Authorization: `Bearer ${this.userService.jwt}`,
        },
      }).toPromise()
      .then((data: any) => {
        return Promise.resolve(data);
      })
      .catch(err => this.userService.logoutHttp401(err) as any);
  }

  async deleteProductById(id: string): Promise<void> {
    await this.http.delete(environment.backend + '/product/' + id, {
      headers: {
        Authorization: `Bearer ${this.userService.jwt}`,
      },
    }).toPromise()
      .then((response) => response)
      .catch(err => this.userService.logoutHttp401(err) as any);
    const index = this.products.findIndex((p: Product) => p._id === id);
    this.products.splice(index, 1);
  }

  getAll(): Product[] {
    return this.products;
  }

  productTypeIcon(input: ProductType | string): string {
    switch (input) {
      case ProductType.ALIMENTACION:
        return 'restaurant';
      case ProductType.HIGIENE:
        return 'hotel';
      case ProductType.PEQUES:
        return 'child_friendly';
      default:
        return 'all_inclusive';
    }
  }

  productTypeIsValid(input: ProductType | string): boolean {
    return Object.values(ProductType).includes(input as any);
  }
}

export interface CreateProductResponseDto {
  ean: string;
  alias: string;
  limits: ProductLimits[];
  pvp: number;
  code: string; // Inner code for every warehouse
  type: string;
  chargeableOutBudget: boolean;
}

export interface Product {
  _id: string;
  ean: string;
  name: string;
  alias: string;
  quantity: string; // peso o unidades
  categories: string;
  ingredients: string;
  allergens: string;
  labels: string;
  imageUrl: string;
  limits: ProductLimits[];
  pvp: number;
  code: string; // Inner code for every warehouse
  type: ProductType;
  chargeableOutBudget: boolean;
  warehouse: string;
}

export interface ProductLimits {
  price: number;
  quantity: number;
}

export enum ProductType {
  ALIMENTACION = 'Alimentación',
  HIGIENE = 'Higiene',
  PEQUES = 'Peques'
}
