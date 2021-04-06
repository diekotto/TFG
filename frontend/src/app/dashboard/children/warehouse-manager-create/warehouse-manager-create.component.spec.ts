import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseManagerCreateComponent } from './warehouse-manager-create.component';

describe('WarehouseManagerCreateComponent', () => {
  let component: WarehouseManagerCreateComponent;
  let fixture: ComponentFixture<WarehouseManagerCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseManagerCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseManagerCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
