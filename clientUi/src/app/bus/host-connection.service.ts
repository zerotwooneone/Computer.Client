import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import * as signalR from "@microsoft/signalr";
import { EventForFrontEnd, HubRouterService } from './hub-router.service';

@Injectable({
  providedIn: 'root'
})
export class HostConnectionService {
  private hubConnection: signalR.HubConnection | undefined;
  constructor(
    private readonly configService: ConfigService,
    private readonly hubRouter: HubRouterService) { }

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
              this.hubRouter.handleEventFromBackend(eventForFrontEnd);
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

  public async getAppConnection(appId: string): Promise<AppConnection | void> {
    if (!this.hubConnection) {
      return;
    }
    const instanceId = Guid.newGuid();
    var details = (await this.hubConnection.invoke("GetConnection", appId, instanceId)) as { readonly instanceId: string | undefined };
    if (!details?.instanceId) {
      return;
    }
    //ideally, we would register (on) before we connect, but we want to use the server provided instance id
    this.hubConnection.on(`ToAppUi:${appId}.${details.instanceId}`, (args: any[]) => {
      console.log("Got ToAppUi")
      console.log("ToAppUi", args);
    })
    return new AppConnection(
      details.instanceId,
      async () => {
        if (!this.hubConnection) {
          return;
        }
        await this.hubConnection.invoke("CloseConnection", appId, instanceId);
      },
    )
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

export class AppConnection {
  public constructor(
    public readonly instanceId: string | undefined,
    private readonly closeConnection: () => Promise<void>,) { }

  public async Dispose(): Promise<void> {
    await this.closeConnection();
  }
}
