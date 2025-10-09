import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { latLng, LatLngExpression } from 'leaflet';
import { map, Observable, shareReplay, take } from 'rxjs';

export interface Favorite {
  name: string;
  coords: [number, number];
}

interface Address {
  street?: string;
  area?: string;
  city?: string;
  state?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  constructor(private readonly http: HttpClient) { }

  getFavorites(): Observable<Favorite[]> {
    return this.http.get<{ favorites: Favorite[] }>('http://localhost:8080/favorites')
      .pipe(
        take(1),
        map(favs => favs.favorites),
        shareReplay(1),
      );
  }

  getAddress(coords: LatLngExpression): Observable<string> {
    const { lat, lng } = latLng(coords);
    return this.http.get<{ address: Address }>('http://localhost:8080/address?coords=' + lat + '&coords=' + lng)
      .pipe(
        take(1),
        map(addr => addr.address),
        map(addr => `${addr.street}, ${addr.area}<br />${addr.city}/${addr.state}`),
        shareReplay(1),
      );
  }
}
