import { Component, OnInit } from '@angular/core';
import { Warehouse, WarehouseService } from '../../services/warehouse/warehouse.service';

@Component({
  selector: 'app-warehouse-manager',
  templateUrl: './warehouse-manager.component.html',
  styleUrls: ['./warehouse-manager.component.css']
})
export class WarehouseManagerComponent implements OnInit {

  warehouses: Warehouse[] = [];
  loading = true;

  constructor(private service: WarehouseService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.service.fetchAll()
        .then((data: Warehouse[]) => {
          this.warehouses = data;
          this.loading = false;
        });
    }, 1000);
  }

}
