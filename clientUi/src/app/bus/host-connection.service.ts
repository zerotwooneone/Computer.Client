import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import * as signalR from "@microsoft/signalr";
import { EventForFrontEnd } from './hub-router.service';
import { HostEventService } from './host-event.service';

@Injectable({
  providedIn: 'root'
})
export class HostConnectionService {
  private hubConnection: signalR.HubConnection | undefined;
  constructor(
    private readonly configService: ConfigService,
    private readonly hostEvent: HostEventService) { }

  public async connect(): Promise<void> {
    const p = new Promise((resolve, reject) => {
      this.configService.Config$.subscribe(async c => {
        if (this.hubConnection) {
          await this.hubConnection?.stop();
        }
        this.hubConnection = new signalR.HubConnectionBuilder()
          .withUrl(`${c.baseUrl}${c.busPath}`)
          .build();

        await this.hubConnection
          .start()
          .then(() => {
            console.info('signalR Connection started');
            this.hubConnection?.on("EventToFrontEnd", (eventForFrontEnd: EventForFrontEnd) => {
              this.hostEvent.onEventFromBackend(eventForFrontEnd);
            })
            resolve(undefined);
          })
          .catch(err => {
            console.error('Error while starting signalR connection: ' + err);
            reject(err);
          });
      });
    });
    await p;
  }

  public async SendEventToBackend(subject: string, value: any, eventId: string, correlationId: string): Promise<void> {
    await this.hubConnection?.invoke("SendEventToBackend", subject, eventId, correlationId, value);
  }
}
