import { TestBed } from '@angular/core/testing';

import { UserManagerCreateService } from './user-manager-create.service';

describe('UserManagerCreateService', () => {
  let service: UserManagerCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserManagerCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
