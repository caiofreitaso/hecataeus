import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Favorite {
  name: string;
  coords: [number, number];
}

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  constructor(private readonly http: HttpClient) { }

  getAll(): Observable<Favorite[]> {
    return this.http.get('http://localhost:8080/favorites')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .pipe(map(favs => (favs as any).favorites));
  }
}
