import { Component, OnInit } from '@angular/core';
import { ItemModel } from '../to-do-item/item-model';

@Component({
  selector: 'cui-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  InitList(): ItemModel[] {
    return [
      new ItemModel("1", true, "first"),
      new ItemModel("2", false, "something"),
      new ItemModel("3", false, undefined, "https://www.google.com"),
      new ItemModel("3", false, undefined, undefined, "https://thumbs.gfycat.com/CalmCooperativeKudu-size_restricted.gif"),];
  }

  public readonly items: ItemModel[] = this.InitList();
  constructor() { }

  ngOnInit(): void {
  }

  public trackByFn(index: number, item: ItemModel) {
    return item.id;
  }

}
