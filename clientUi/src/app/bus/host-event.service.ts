import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EventForFrontEnd } from './hub-router.service';

@Injectable({
  providedIn: 'root'
})
export class HostEventService {
  private readonly subject = new Subject<EventForFrontEnd>();
  public get event$(): Observable<EventForFrontEnd> { return this.subject.asObservable(); }
  public onEventFromBackend(eventForFrontEnd: EventForFrontEnd) {
    this.subject.next(eventForFrontEnd);
  }

  constructor() { }
}
