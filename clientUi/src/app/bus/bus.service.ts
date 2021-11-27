import { Injectable } from '@angular/core';
import { filter, map, Observable, Subject } from 'rxjs';
import { BusEvent } from './BusEvent';

@Injectable()
export class BusService {

  private readonly _bus = new Subject<BusEvent>();

  constructor() { }

  public publish<T>(event: string, value: T): void {
    const e: BusEvent = { event, value };
    this._bus.next(e);
  }

  public subscribe<T>(event: string): Observable<T> {
    return this._bus.pipe(
      filter(e => e.event === event),
      map(e => e.value as T));
  }
}

