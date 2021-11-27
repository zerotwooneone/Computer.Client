import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DeltaItemDto } from '../dto/DeltaItemDto';
import { ListItemDto } from '../dto/ListItemDto';
import { ListUpdate } from '../dto/ListUpdate';
import { ListService } from '../list.service';
import { ItemModel } from '../to-do-item/item-model';

@Component({
  selector: 'cui-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  // InitList(): ItemModel[] {
  //   return [
  //     new ItemModel("1", true, "first"),
  //     new ItemModel("2", false, "something"),
  //     new ItemModel("3", false, undefined, "https://www.google.com"),
  //     new ItemModel("3", false, undefined, undefined, "https://thumbs.gfycat.com/CalmCooperativeKudu-size_restricted.gif"),];
  // }

  //public readonly items: ItemModel[] = this.InitList();
  public readonly items$: BehaviorSubject<ItemModel[]> = new BehaviorSubject([] as ItemModel[]);
  private readonly subscriptions: Subscription[] = [];
  constructor(private readonly listService: ListService) { }
  ngOnDestroy(): void {
    if (this.subscriptions && this.subscriptions.length) {
      this.subscriptions.forEach(element => {
        try {
          element.unsubscribe();
        } catch (error) {
          //ignore
        }
      });
    }
  }

  ngOnInit(): void {
    this.subscriptions.push(this.listService.getList("dummy list id")
      .subscribe(a => {
        const x = this.convert(a);
        this.items$.next(x);
      }));

  }
  convert(a: ListUpdate): ItemModel[] {
    if (a.delta) {
      const current = this.items$.value;
      //reverse to handle deletions
      a.delta.items.reverse().forEach((element, index) => {
        if (element.deleted) {
          delete current[element.index];
          return;
        }
        current[element.index] = this.convertDeltaItem(element, index);
      });
      return current;
    }
    if (!a.list) {
      //this should never happen
      return this.items$.value;
    }
    const next = a.list.items.map((a, i) => this.convertItem(a, i));
    return next;
  }
  private convertItem(a: ListItemDto, index: number): ItemModel {
    return new ItemModel(String(index), a.checked, a.text, a.link, a.imageUrl);
  }
  private convertDeltaItem(element: DeltaItemDto, index: number): ItemModel {
    return new ItemModel(String(index), element.checked, element.text, element.link, element.imageUrl)
  }

  public trackByFn(index: number, item: ItemModel) {
    return item.id;
  }

}
