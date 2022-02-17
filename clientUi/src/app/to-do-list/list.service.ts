import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, delay, finalize, firstValueFrom, from, Observable, throwError, timer } from 'rxjs';
import { BusService } from '../bus/bus.service';
import { AppService } from '../computerApp/app.service';
import { AppConnection } from '../computerApp/AppConnection';
import { DeltaItemDto } from './dto/DeltaItemDto';
import { ListDelta } from './dto/ListDelta';
import { ListDto } from './dto/ListDto';
import { ListItemDto } from './dto/ListItemDto';
import { ListUpdate } from './dto/ListUpdate';
import { StartupModel } from './dto/StartupModel';

@Injectable()
export class ListService {
  //const conn = await this.hostConnection.getAppConnection();
  constructor(
    private readonly bus: BusService,
    private readonly appService: AppService,
    private readonly httpClient: HttpClient) { }

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

  public async connectApp(): Promise<AppConnection | undefined> {
    console.warn(await this.getDefaultList());
    return await this.appService.getAppConnection("ToDoList");
  }

  public async getDefaultList(): Promise<StartupModel> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        //Authorization: 'my-auth-token'
      })
    }
    return await firstValueFrom(this.httpClient.post<StartupModel>("https://localhost:7139/startup",
      {
        "this thing": "client post"
      },
      httpOptions).pipe(
        catchError((err, obs) => this.handleError(err)),
      ));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}


