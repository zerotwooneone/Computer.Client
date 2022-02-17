import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ItemModelDto } from 'src/app/startup/ItemModelDto';
import { ListModel } from 'src/app/startup/ListModel';
import { ListService } from '../list.service';
import { ItemModel } from '../to-do-item/item-model';

@Component({
  selector: 'cui-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  @Input() listModel?: ListModel;
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
    if (this.listModel) {
      this.items$.next(this.convert(this.listModel))
    }
  }
  convert(a: ListModel): ItemModel[] {
    const next = a.items.map((a, i) => this.convertItem(a, i));
    return next;
  }
  private convertItem(a: ItemModelDto, index: number): ItemModel {
    return new ItemModel(String(index), a.checked, a.text, a.url, a.imageUrl);
  }

  public trackByFn(index: number, item: ItemModel) {
    return item.id;
  }

}
