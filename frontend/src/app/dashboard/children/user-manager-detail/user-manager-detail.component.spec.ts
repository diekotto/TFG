import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagerDetailComponent } from './user-manager-detail.component';

describe('UserManagerDetailComponent', () => {
  let component: UserManagerDetailComponent;
  let fixture: ComponentFixture<UserManagerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserManagerDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
