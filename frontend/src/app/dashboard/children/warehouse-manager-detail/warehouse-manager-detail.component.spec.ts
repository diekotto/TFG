import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseManagerDetailComponent } from './warehouse-manager-detail.component';

describe('WarehouseManagerDetailComponent', () => {
  let component: WarehouseManagerDetailComponent;
  let fixture: ComponentFixture<WarehouseManagerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseManagerDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseManagerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
