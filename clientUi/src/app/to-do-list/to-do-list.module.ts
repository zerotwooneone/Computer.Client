import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToDoItemComponent } from './to-do-item/to-do-item.component';
import { ListComponent } from './list/list.component';
import { ListService } from './list.service';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    ToDoItemComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    ListComponent,
  ],
  providers: [
    ListService,    
  ]
})
export class ToDoListModule { }
