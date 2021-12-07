import { TestBed } from '@angular/core/testing';

import { HostEventService } from './host-event.service';

describe('HostEventService', () => {
  let service: HostEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HostEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
