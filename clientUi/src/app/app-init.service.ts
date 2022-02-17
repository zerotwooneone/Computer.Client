import { Injectable } from '@angular/core';
import { catchError, EMPTY, first, takeUntil, timer } from 'rxjs';
import { HostConnectionService } from './bus/host-connection.service';
import { HubRouterService } from './bus/hub-router.service';
import { ConfigModel } from './config/config-model';
import { ConfigService } from './config/config.service';
import { StartupService } from './startup/startup.service';
import { StartupService as ToDoListStartup } from './to-do-list/startup.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {
  constructor(
    private readonly configService: ConfigService,
    private readonly hostConnection: HostConnectionService,
    private readonly hubRouter: HubRouterService,
    private readonly startupService: StartupService,
    private readonly toDoListStartup: ToDoListStartup,
  ) { }

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
        console.error(`Didn't get initial config for some reason. ${err}`);
        return EMPTY;
      })
    ).subscribe();

    await this.hubRouter.restartListening();

    await this.hostConnection.connect();

    const startup = await this.startupService.getStartup("some dummy user id");
    console.warn(startup);
    await this.toDoListStartup.OnStartup(startup.default);
  }
}

export function initializeFactory(service: AppInitService): () => Promise<any> {
  //any delay in the resolution of this promise will delay the start of the app
  return async () => await service.OnAppStart();
}
