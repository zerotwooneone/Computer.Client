import { Injectable } from '@angular/core';
import { delay, finalize, from, Observable, timer } from 'rxjs';
import { BusService } from '../bus/bus.service';
import { HostConnectionService } from '../bus/host-connection.service';
import { DeltaItemDto } from './dto/DeltaItemDto';
import { ListDelta } from './dto/ListDelta';
import { ListDto } from './dto/ListDto';
import { ListItemDto } from './dto/ListItemDto';
import { ListUpdate } from './dto/ListUpdate';

@Injectable()
export class ListService {
  //const conn = await this.hostConnection.getAppConnection();
  constructor(
    private readonly bus: BusService,
    private readonly hostConnection: HostConnectionService) { }

  public getList(id: string): Observable<ListUpdate> {
    const subjectId = `listchanged.${id}`;
    const result = this.bus.subscribe<ListUpdate>(subjectId);

    from([1]).pipe(
      delay(100),
      finalize(() => {
        const newList = ListService.createDefaultList();
        this.bus.publish(subjectId, newList);
      })
    ).subscribe();
    var updateItem = timer(150, 1000)
      .subscribe(i => {
        const delta = ListUpdate.deltaFactory("002", new ListDelta(
          "first id",
          [new DeltaItemDto(
            3,
            true,
            `${new Date()}`)]
        ));
        this.bus.publish(subjectId, delta);
      });

    return result;
  }

  //todo: this is a placeholder till we get a list from a source
  private static createDefaultList(): ListUpdate {
    const list = new ListDto("first id", [
      new ListItemDto(
        false,
        "first text"),
      new ListItemDto(
        true,
        undefined,
        "https://www.google.com"),
      new ListItemDto(
        false,
        undefined,
        undefined,
        "https://thumbs.gfycat.com/CalmCooperativeKudu-size_restricted.gif"),
    ]);
    return ListUpdate.listfactory("001", list);
  }

  public async connectApp(): Promise<void> {
    const appConnection = await this.hostConnection.getAppConnection("ToDoList");
  }
}


