import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductManagerDetailComponent } from './product-manager-detail.component';

describe('ProductManagerDetailComponent', () => {
  let component: ProductManagerDetailComponent;
  let fixture: ComponentFixture<ProductManagerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductManagerDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductManagerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
