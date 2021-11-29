import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, shareReplay, Subject } from 'rxjs';
import { ConfigModel } from './config-model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly ConfigSubject = new ReplaySubject<ConfigModel>(1);
  public readonly Config$: Observable<ConfigModel> = this.ConfigSubject.asObservable();

  public onNewConfig(config: ConfigModel): void {
    this.ConfigSubject.next(config);
  }
}
