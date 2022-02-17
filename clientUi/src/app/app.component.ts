import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ListModel } from './startup/ListModel';
import { ListService } from './to-do-list/list.service';

@Component({
  selector: 'cui-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'clientUi';
  defaultList$: Observable<ListModel> | undefined;
  constructor(private readonly listService: ListService) { }

  ngOnInit(): void {
    this.defaultList$ = this.listService.defaultModel$;
  }

}
