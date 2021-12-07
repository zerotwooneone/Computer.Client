import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { BusService } from './bus.service';
import { events as AppEvents } from '../computerApp/app.service';
import { HostEventService } from './host-event.service';
import { HostConnectionService } from './host-connection.service';

@Injectable({
  providedIn: 'root'
})
export class HubRouterService {
  private subscriptions: Subscription[] = [];
  private eventsForFrontend: eventHash = {};
  constructor(
    private readonly bus: BusService,
    hostEvent: HostEventService,
    private readonly hostConnection: HostConnectionService) {
    hostEvent.event$.subscribe(e => this.handleEventFromBackend(e));
  }

  public restartListening(): Promise<undefined> {
    this.eventsForFrontend = AppEvents.FromUiToBackend.reduce((previous, current, index) => {
      previous[current] = true;
      return previous;
    }, {} as eventHash)
    this.stopListening();
    if (AppEvents && AppEvents.FromBackendToUi.length) {
      AppEvents.FromUiToBackend.forEach(subject => {
        this.subscriptions.push(
          this.bus.subscribeToEvent(subject)
            .subscribe(busEvent => {
              this.hostConnection.SendEventToBackend(subject, busEvent.value, busEvent.eventId, busEvent.correlationId)
            })
        )
      });
    }
    return Promise.resolve(undefined);
  }

  public stopListening(): void {
    this.eventsForFrontend = {};
    if (!this.subscriptions) {
      return;
    }
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private handleEventFromBackend(eventForFrontEnd: EventForFrontEnd) {
    if (!eventForFrontEnd || !eventForFrontEnd.subject) {
      return;
    }
    if (this.eventsForFrontend[eventForFrontEnd.subject]) {
      this.bus.publish(eventForFrontEnd.subject, eventForFrontEnd.eventObj, eventForFrontEnd.eventId, eventForFrontEnd.correlationId);
    }
  }
}

export type EventForFrontEnd = {
  subject: string;
  eventId: string;
  correlationId: string;
  eventObj?: any
}

type eventHash = { [key: string]: true };
