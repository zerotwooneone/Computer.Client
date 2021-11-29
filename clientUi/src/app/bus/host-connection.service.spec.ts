import { TestBed } from '@angular/core/testing';

import { HostConnectionService } from './host-connection.service';

describe('HostConnectionService', () => {
  let service: HostConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HostConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
