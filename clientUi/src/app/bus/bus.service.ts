import { Injectable } from '@angular/core';
import { filter, finalize, map, Observable, of, publish, share, shareReplay, Subject, take, timeout } from 'rxjs';
import { BusEvent } from './BusEvent';

@Injectable()
export class BusService {
  private readonly _subscriptions: { [subject: string]: Subject<BusEvent> } = {};

  constructor() { }

  public publish<T>(
    subject: string,
    value: T,
    eventId?: string,
    correlationId?: string): void {
    const e: BusEvent = new BusEvent(subject, value, eventId, correlationId);
    this.innerPublish(subject, e);
  }

  private innerPublish(subject: string, e: BusEvent): void {
    this._subscriptions[subject]?.next(e);
  }

  public subscribe<T>(subject: string): Observable<T> {
    return this.subscribeToEvent(subject).pipe(
      filter(e => e.subject === subject),
      map(e => e.value as T));
  }

  public subscribeToEvent(subject: string): Observable<BusEvent> {
    const createNew = (): Subject<BusEvent> => {
      const newSubject = new Subject<BusEvent>();
      const observable = newSubject.pipe(
        share(),
        finalize(() => {
          delete this._subscriptions[subject]; //todo: this may not work at all
        })
      );
      this._subscriptions[subject] = newSubject;
      return newSubject;
    };
    const result = this._subscriptions[subject] ?? createNew();
    return result.asObservable();
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

    this.innerPublish(requestSubject, event);

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

