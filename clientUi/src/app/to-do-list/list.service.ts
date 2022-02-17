import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, finalize, from, Observable, timer } from 'rxjs';
import { BusService } from '../bus/bus.service';
import { ListModel } from '../startup/ListModel';
import { Events } from './bus/events';
import { DeltaItemDto } from './dto/DeltaItemDto';
import { ListDelta } from './dto/ListDelta';
import { ListDto } from './dto/ListDto';
import { ListItemDto } from './dto/ListItemDto';
import { ListUpdate } from './dto/ListUpdate';

@Injectable()
export class ListService {
  private readonly _defaultModel$ = new BehaviorSubject<ListModel>({
    id: "default",
    items: []
  });
  public get defaultModel$(): Observable<ListModel> {
    return this._defaultModel$.asObservable();
  }
  public get defaultModel(): ListModel {
    return this._defaultModel$.value;
  }
  constructor(
    private readonly bus: BusService) { }

  public async startListening(): Promise<undefined> {
    this.bus.subscribe<ListModel>(Events.NewDefaultList).subscribe(this.OnDefaultModel.bind(this));
    return;
  }
  OnDefaultModel(listModel: ListModel) {
    this._defaultModel$.next(listModel)
  }

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
}


