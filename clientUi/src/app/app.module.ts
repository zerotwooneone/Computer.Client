import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToDoListModule } from './to-do-list/to-do-list.module';
import { AppInitService, initializeFactory } from './app-init.service';
import { BusModule } from './bus/bus.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule,
    ToDoListModule,
    BusModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFactory,
      multi: true,
      deps: [AppInitService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
