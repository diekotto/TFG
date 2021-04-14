import { TestBed } from '@angular/core/testing';

import { InvoiceWsService } from './invoice-ws.service';

describe('InvoicesService', () => {
  let service: InvoiceWsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceWsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
