import { TestBed } from '@angular/core/testing';

import { FuturesService } from './futures.service';

describe('FuturesService', () => {
  let service: FuturesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FuturesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
