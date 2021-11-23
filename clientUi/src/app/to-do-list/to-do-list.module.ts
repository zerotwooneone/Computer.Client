import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToDoItemComponent } from './to-do-item/to-do-item.component';
import { ListComponent } from './list/list.component';



@NgModule({
  declarations: [
    ToDoItemComponent,
    ListComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ListComponent,
  ]
})
export class ToDoListModule { }
