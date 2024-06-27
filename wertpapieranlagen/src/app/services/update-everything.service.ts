import { Injectable } from '@angular/core';

export interface Updateable {
  update(): void;
}

@Injectable({
  providedIn: 'root'
})
export class UpdateEverythingService {
  // Folgt dem Beobachter-Muster und zielt ab, alle Komponenten zu aktualisieren, die sich für Updates angemeldet haben

  subscribers = new Set<Updateable>();

  subscribeToUpdates(object: Updateable) {
    this.subscribers.add(object);
  }

  updateAll() {
    this.subscribers.forEach(subscriber => subscriber.update());
  }
}
