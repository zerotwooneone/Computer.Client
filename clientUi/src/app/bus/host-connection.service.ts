import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import * as signalR from "@microsoft/signalr";

@Injectable({
  providedIn: 'root'
})
export class HostConnectionService {
  private hubConnection: signalR.HubConnection | undefined;
  constructor(private readonly configService: ConfigService) { }

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

  public async getAppConnection(): Promise<AppConnectionDetails | void> {
    if (!this.hubConnection) {
      return;
    }
    var details = (await this.hubConnection.invoke("GetConnection", Guid.newGuid())) as AppConnectionDetails;
    console.log(details);
  }
}

export class Guid {
  static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

type AppConnectionDetails = {
  readonly InstanceId: string | undefined;
}
