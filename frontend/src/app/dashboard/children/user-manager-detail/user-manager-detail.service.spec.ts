import { TestBed } from '@angular/core/testing';

import { UserManagerDetailService } from './user-manager-detail.service';

describe('UserManagerDetailService', () => {
  let service: UserManagerDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserManagerDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
