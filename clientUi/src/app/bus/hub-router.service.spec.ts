import { TestBed } from '@angular/core/testing';

import { HubRouterService } from './hub-router.service';

describe('HubRouterService', () => {
  let service: HubRouterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HubRouterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
