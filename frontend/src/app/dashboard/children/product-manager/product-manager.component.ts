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

  constructor(
    private service: ProductService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.service.fetchAll()
        .then((data: Product[]) => {
          this.products = data;
          this.loading = false;
        });
    }, 1000);
  }

}
