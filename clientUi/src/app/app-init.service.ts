import { Injectable } from '@angular/core';
import { catchError, EMPTY, first, take, takeUntil, timer } from 'rxjs';
import { HostConnectionService } from './bus/host-connection.service';
import { ConfigModel } from './config/config-model';
import { ConfigService } from './config/config.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {
  async OnAppStart(): Promise<any> {
    //any delay in the resolution of this promise will delay the start of the app
    console.info('app started');

    this.configService.onNewConfig(new ConfigModel(
      "https://localhost:7139",
      "/bus",
    ));

    this.configService.Config$.pipe(
      takeUntil(timer(1000)),
      first(),
      catchError((err, caught) => {
        console.error("Didn't get initial config for some reason.");
        return EMPTY;
      })
    ).subscribe();

    await this.hostConnection.connect();
  }

  constructor(
    private readonly configService: ConfigService,
    private readonly hostConnection: HostConnectionService,
  ) { }
}

export function initializeFactory(service: AppInitService): () => Promise<any> {
  //any delay in the resolution of this promise will delay the start of the app
  return async () => await service.OnAppStart();
}
