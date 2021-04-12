import { Component, OnInit } from '@angular/core';
import { Product, ProductService, ProductType } from '../../services/product/product.service';

@Component({
  selector: 'app-product-manager',
  templateUrl: './product-manager.component.html',
  styleUrls: ['./product-manager.component.css']
})
export class ProductManagerComponent implements OnInit {

  loading = true;
  products: Product[] = [];
  hygiene: Product[] = [];
  children: Product[] = [];
  untyped: Product[] = [];
  deleting: { [index: string]: boolean } = {};

  constructor(
    public service: ProductService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.service.fetchAll()
        .then((data: Product[]) => {
          const sortedData = this.sortProducts(data.filter((p: Product) => p.alias));
          [this.products, this.hygiene, this.children, this.untyped] = this.sliceByProductType(sortedData);
          this.loading = false;
        });
    }, 500);
  }

  onClickPrepareDelete(id: string): void {
    this.deleting[id] = true;
  }

  onClickCancelDelete(id: string): void {
    delete this.deleting[id];
  }

  async onClickDeleteButton(id: string): Promise<void> {
    delete this.deleting[id];
    await this.service.deleteProductById(id);
    const sortedData = this.sortProducts(this.service.getAll());
    [this.products, this.hygiene, this.children, this.untyped] = this.sliceByProductType(sortedData);
  }

  sortProducts(products: Product[]): Product[] {
    return products.sort((a, b) => {
      if (a.alias < b.alias) {
        return -1;
      }
      if (a.alias > b.alias) {
        return 1;
      }
      return 0;
    });
  }

  sliceByProductType(input: Product[]): Product[][] {
    const products: Product[] = input.filter((p: Product) => p.type === ProductType.ALIMENTACION);
    const hygiene: Product[] = input.filter((p: Product) => p.type === ProductType.HIGIENE);
    const children: Product[] = input.filter((p: Product) => p.type === ProductType.PEQUES);
    const untyped: Product[] = input.filter((p: Product) => !this.service.productTypeIsValid(p.type));
    return [products, hygiene, children, untyped];
  }
}
