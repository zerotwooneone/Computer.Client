import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import * as signalR from "@microsoft/signalr";

@Injectable({
  providedIn: 'root'
})
export class HostConnectionService {
  private hubConnection: signalR.HubConnection | undefined;
  constructor(private readonly configService: ConfigService) { }

  public connect(): void {
    this.configService.Config$.subscribe(async c => {
      if (this.hubConnection) {
        await this.hubConnection?.stop();
      }
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${c.baseUrl}${c.busPath}`)
        .build();

      this.hubConnection
        .start()
        .then(() => console.info('signalR Connection started'))
        .catch(err => console.error('Error while starting signalR connection: ' + err));
    });

  }
}
