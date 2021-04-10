import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-product-manager',
  templateUrl: './product-manager.component.html',
  styleUrls: ['./product-manager.component.css']
})
export class ProductManagerComponent implements OnInit {

  loading = true;
  products: Product[] = [];
  deleting: { [index: string]: boolean } = {};

  constructor(
    private service: ProductService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.service.fetchAll()
        .then((data: Product[]) => {
          this.products = data.filter((p: Product) => p.alias);
          this.loading = false;
        });
    }, 1000);
  }

  onClickPrepareDelete(id: string): void {
    this.deleting[id] = true;
  }

  onClickCancelDelete(id: string): void {
    delete this.deleting[id];
  }

  async onClickDeleteButton(id: string, ean: string): Promise<void> {
    delete this.deleting[id];
    await this.service.deleteProductById(ean);
    this.products = this.service.getAll();
  }
}
