import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BusService } from '../bus/bus.service';
import { ListDto } from './dto/ListDto';
import { ListItemDto } from './dto/ListItemDto';
import { ListUpdate } from './dto/ListUpdate';

@Injectable()
export class ListService {
  private readonly updateSubject: BehaviorSubject<ListUpdate> = new BehaviorSubject(ListService.createDefaultList());

  constructor(bus: BusService) { }

  public getList(id: string): Observable<ListUpdate> {
    return this.updateSubject.asObservable();
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
        true,
        undefined,
        undefined,
        "https://thumbs.gfycat.com/CalmCooperativeKudu-size_restricted.gif"),
    ]);
    return ListUpdate.listfactory("001", list);
  }
}


