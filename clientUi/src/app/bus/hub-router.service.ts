import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { BusService } from './bus.service';
import { HostEventService } from './host-event.service';
import { HostConnectionService } from './host-connection.service';

@Injectable({
  providedIn: 'root'
})
export class HubRouterService {
  private subscriptions: Subscription[] = [];
  private fromBackEndToUi: eventHash = {};
  constructor(
    private readonly bus: BusService,
    private readonly hostEvent: HostEventService,
    private readonly hostConnection: HostConnectionService) {
  }

  public restartListening(): Promise<undefined> {
    this.stopListening();

    this.subscriptions.push(
      this.hostEvent.event$.subscribe(e => this.handleEventFromBackend(e))
    );
    console.log("HubRouterService subscribed");
    const fromBackendToUi: string[] = []; //todo: fill this out
    this.fromBackEndToUi = fromBackendToUi.reduce((previous, current, index) => {
      previous[current] = true;
      return previous;
    }, {} as eventHash)

    const fromUiToBackend: string[] = []; //todo: fill this out
    if (fromUiToBackend.length) {
      fromUiToBackend.forEach(subject => {
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
    this.fromBackEndToUi = {};
    if (!this.subscriptions) {
      return;
    }
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private handleEventFromBackend(eventForFrontEnd: EventForFrontEnd) {
    if (!eventForFrontEnd || !eventForFrontEnd.subject) {
      return;
    }
    if (this.fromBackEndToUi[eventForFrontEnd.subject]) {
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
