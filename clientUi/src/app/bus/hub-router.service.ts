import { Injectable } from '@angular/core';
import { BusService } from './bus.service';

@Injectable({
  providedIn: 'root'
})
export class HubRouterService {
  handleEventFromBackend(eventForFrontEnd: any) {
    console.log("EventToFrontEnd", eventForFrontEnd);
  }

  constructor(private readonly bus: BusService) { }
}

export type EventForFrontEnd = {
  subject: string;
  eventId: string;
  correlationId: string;
  eventObj?: any
}
