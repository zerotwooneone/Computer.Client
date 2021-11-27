import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {
  async OnAppStart(): Promise<any> {
    //any delay in the resolution of this promise will delay the start of the app
    console.info('app started');
  }

  constructor() { }
}

export function initializeFactory(service: AppInitService): () => Promise<any> {
  //any delay in the resolution of this promise will delay the start of the app
  return async () => await service.OnAppStart();
}
