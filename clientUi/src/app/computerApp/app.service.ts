import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BusService } from '../bus/bus.service';
import { Guid } from '../utils/Guid';
import { AppConnection } from './AppConnection';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private readonly bus: BusService) { }

  public async getAppConnection(appId: string): Promise<AppConnection | undefined> {
    const instanceId = Guid.newGuid();
    const request = {
      instanceId: instanceId,
      appId: appId,
    } as AppConnectionRequest;
    const response = await firstValueFrom(this.bus.request<AppConnectionRequest, AppConnectionResponse>("GetConnection", "GetConnectionResponse", request));
    if (!response || !response.success || !response.data) {
      console.error("response failed", response);
      return;
    }
    console.log('got response', response);
    return new AppConnection(
      response.data.instanceId,
      async () => {
        const disconnectRequest = {
          instanceId: instanceId,
          appId: appId,
        } as AppDisconnectRequest;
        const response = await firstValueFrom(this.bus.request<AppDisconnectRequest, any>("CloseConnection", "CloseConnectionResponse", disconnectRequest));
      },
    )
  }
}

type AppDisconnectRequest = {
  instanceId: string,
  appId: string,
}

type AppConnectionRequest = {
  instanceId?: string,
  appId: string,
}

type AppConnectionResponse = {
  instanceId: string;
}

export class events {
  public static readonly FromUiToBackend: string[] = [
    "GetConnection",
    "GetConnectionResponse",
    "CloseConnection",
    "CloseConnectionResponse",
  ];
  public static readonly FromBackendToUi: string[] = [
    "GetConnectionResponse",
    "CloseConnectionResponse",
  ];
}


