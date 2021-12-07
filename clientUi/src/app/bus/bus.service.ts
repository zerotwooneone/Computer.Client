import { Injectable } from '@angular/core';
import { filter, map, Observable, of, shareReplay, Subject, take, timeout } from 'rxjs';
import { BusEvent } from './BusEvent';

@Injectable()
export class BusService {
  private readonly _bus = new Subject<BusEvent>();

  constructor() { }

  public publish<T>(
    subject: string,
    value: T,
    eventId?: string,
    correlationId?: string): void {
    const e: BusEvent = new BusEvent(subject, value, eventId, correlationId);
    this.innerPublish(e);
  }

  private innerPublish(e: BusEvent): void {
    this._bus.next(e);
  }

  public subscribe<T>(subject: string): Observable<T> {
    return this.subscribeToEvent(subject).pipe(
      filter(e => e.subject === subject),
      map(e => e.value as T));
  }

  public subscribeToEvent(event: string): Observable<BusEvent> {
    return this._bus.pipe(
      filter(e => e.subject === event));
  }

  public request<TRequest, TResponse>(
    requestSubject: string,
    responseSubject: string,
    value: TRequest,
    timeoutMs: number = 1000,
    eventId?: string,
    correlationId?: string): Observable<RequestResponse<TResponse> | RequestResponseFailure> {
    const event = new BusEvent(requestSubject, value, eventId, correlationId);
    const response$ = this.subscribeToEvent(responseSubject).pipe(
      filter(e => e.correlationId === event.correlationId),
      take(1),
      map(a => {
        return {
          data: a.value as TResponse,
          success: true,
        } as RequestResponse<TResponse>;
      }),
      timeout({
        each: timeoutMs,
        with: () => of({
          success: false,
          errorCode: 1,
        } as RequestResponseFailure)
      }),
      shareReplay({
        refCount: false,
        bufferSize: 1,
      })
    );

    this.innerPublish(event);

    return response$;
  }
}

export type RequestResponse<T> = {
  readonly success: true;
  readonly data?: T;
}

export type RequestResponseFailure = {
  readonly success: false;
  readonly errorCode: number;
}

