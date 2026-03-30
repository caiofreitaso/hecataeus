import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { latLng, LatLngExpression } from 'leaflet';
import { map, Observable, shareReplay, take } from 'rxjs';
import { environment } from '../../../environments/environment';
import { exists } from '../../util/format';

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
    return this.http.get<{ favorites: Favorite[] }>(`${environment.hermesUri}/favorites`)
      .pipe(
        take(1),
        map(favs => favs.favorites),
        shareReplay(1),
      );
  }

  getAddress(coords: LatLngExpression): Observable<string> {
    const { lat, lng } = latLng(coords);
    return this.http.get<{ address: Address }>(`${environment.hermesUri}/address?coords=${lat}&coords=${lng}`)
      .pipe(
        take(1),
        map(addr => addr.address),
        map(addr => `${[addr.street, addr.area].filter(exists).join(', ')}<br />${addr.city}/${addr.state}`),
        shareReplay(1),
      );
  }
}
