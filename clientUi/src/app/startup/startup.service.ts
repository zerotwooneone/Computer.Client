import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { StartupModel } from './StartupModel';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StartupService {

  constructor(
    private readonly httpClient: HttpClient,) { }

  public async getStartup(userId: string): Promise<StartupModel> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        //Authorization: 'my-auth-token'
      })
    }
    return await firstValueFrom(this.httpClient.post<StartupModel>("https://localhost:7139/startup",
      {
        userId: userId,
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
