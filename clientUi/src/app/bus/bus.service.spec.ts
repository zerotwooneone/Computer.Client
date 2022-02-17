import { TestBed } from '@angular/core/testing';

import { BusService } from './bus.service';

describe('BusService', () => {
  let service: BusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusService]
    });
    service = TestBed.inject(BusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should publish', async () => {
    const subject = "test";
    type eventType = { someTest: string };
    let actualEvent: eventType | undefined;
    service.subscribe<eventType>(subject).subscribe(e => {
      actualEvent = e;
    });

    const expectedString = "some test string";
    service.publish<eventType>(subject, { someTest: expectedString });

    expect(actualEvent).toBeTruthy();
    expect(actualEvent?.someTest).toBe(expectedString);
  });
});
