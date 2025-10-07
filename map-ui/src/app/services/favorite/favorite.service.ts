import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface SavedPoint {
  id: number;
  name: string;
  way: GeoJSON.Point;
}

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  constructor() { }

  getAll(): Observable<SavedPoint[]> {
    return of([]);
  }
}
