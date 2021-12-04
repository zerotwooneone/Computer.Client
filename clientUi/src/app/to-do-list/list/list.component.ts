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
  public readonly items$: BehaviorSubject<ItemModel[]> = new BehaviorSubject([] as ItemModel[]);
  private readonly subscriptions: Subscription[] = [];
  constructor(
    private readonly listService: ListService) { }
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

  async ngOnInit(): Promise<void> {
    this.subscriptions.push(this.listService.getList("dummy list id")
      .subscribe(a => {
        const x = this.convert(a);
        this.items$.next(x);
      }));
    await this.listService.connectApp();
  }
  convert(a: ListUpdate): ItemModel[] {
    if (a.delta) {
      const current = this.items$.value;
      //reverse to handle deletions
      a.delta.items.sort(a => a.index).reverse().forEach((element, index) => {
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
