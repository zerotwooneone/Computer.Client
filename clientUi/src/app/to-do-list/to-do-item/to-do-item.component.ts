import { Component, Input, OnInit } from '@angular/core';
import { ItemModel } from './item-model';

@Component({
  selector: 'cui-to-do-item',
  templateUrl: './to-do-item.component.html',
  styleUrls: ['./to-do-item.component.scss']
})
export class ToDoItemComponent implements OnInit {
  @Input() item: ItemModel = new ItemModel("-999", false);
  public get id(): string {
    return this.item.id;
  }
  public get text(): string | undefined {
    return this.item.text;
  }
  public get imageUrl(): string | undefined {
    return this.item.imageUrl;
  }
  public get url(): string | undefined {
    return this.item.url;
  }
  public get checked(): boolean {
    return this.item.checked;
  }
  public get readonly(): boolean {
    return this.item.readonly ?? true;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
