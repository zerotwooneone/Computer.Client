import { Injectable } from '@angular/core';
import { BusService } from '../bus/bus.service';
import { ListModel } from '../startup/ListModel';
import { Events } from './bus/events';
import { ListService } from './list.service';

@Injectable({
  providedIn: 'root'
})
export class StartupService {

  constructor(private readonly bus: BusService,
    private readonly listService: ListService) { }

  public async OnStartup(defaultList?: ListModel): Promise<undefined> {
    await this.listService.startListening();

    if (defaultList) {
      this.bus.publish(Events.NewDefaultList, defaultList);
    }

    return;
  }
}
