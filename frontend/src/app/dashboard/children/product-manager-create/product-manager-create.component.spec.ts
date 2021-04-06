import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductManagerCreateComponent } from './product-manager-create.component';

describe('ProductManagerCreateComponent', () => {
  let component: ProductManagerCreateComponent;
  let fixture: ComponentFixture<ProductManagerCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductManagerCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductManagerCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
