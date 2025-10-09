import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as L from 'leaflet';
import { map, take } from 'rxjs';
import { environment } from '../../environments/environment';
import { BackendService } from '../services/backend/backend.service';
import { Dictionary, MapState, MarkerClass, MarkerSvg, MarkerType } from './map.model';

const BASE_ICON_URI = 'https://raw.githubusercontent.com/gravitystorm/openstreetmap-carto/refs/heads/master/symbols/';
const initialState: MapState = {
  coords: [-5.864511, -35.199921],
  zoom: 7,
}

function getSizeFactor(tileSize: number): number {
  let scale = tileSize / 256;

  for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
    scale >>= 1;

    if (scale === 0) {
      return i;
    }
  }

  return 0;
}

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MapComponent implements OnInit, AfterViewInit {

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  private readonly overlays: Dictionary<L.LayerGroup> = {
    'Favorites': new L.LayerGroup([], { attribution: 'Powered by k10forgotten' }),
    'Amenities': new L.LayerGroup([]),
    'Shops': new L.LayerGroup([]),
    'Tourism': new L.LayerGroup([]),
  };
  private map: L.Map | undefined = undefined;
  private currentMarker: L.Marker = new L.Marker([0, 0]);
  private readonly ClickIcon: L.Icon = new L.Icon({
    iconUrl: '/marker.png',
    iconSize: [30, 36],
    iconAnchor: [15, 36],
    popupAnchor: [0, -20],
  });

  // eslint-disable-next-line no-unused-vars
  constructor(private readonly backend: BackendService) { }

  ngOnInit(): void {
    this.backend.getFavorites()
      .pipe(
        take(1),
        map(favs => favs.map(f => this.createMarker(f.coords, MarkerType.Favorite, f.name)))
      )
      .subscribe(favorites => {
        for (const point of favorites) {
          point.addTo(this.overlays['Favorites']);
        }
      });
  }

  ngAfterViewInit(): void {
    const sizeFactor = getSizeFactor(environment.tileSize);
    this.map = new L.Map(this.mapContainer.nativeElement, {
      center: initialState.coords,
      zoom: initialState.zoom,
      maxBounds: [[-180, -180], [180, 180]],
    });
    const OpenStreetMap = new L.TileLayer(`${environment.tileServer}/{z}/{x}/{y}.png`, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      maxNativeZoom: 19,
      minZoom: sizeFactor,
      tileSize: environment.tileSize,
      zoomOffset: -sizeFactor,
      updateWhenIdle: true,
    });

    L.control.scale({ maxWidth: 300, imperial: false, position: 'bottomright' }).addTo(this.map);
    L.control.layers({ OpenStreetMap }, this.overlays, { collapsed: false, position: 'bottomleft' }).addTo(this.map);

    this.map.on('click', event => {
      this.currentMarker?.removeFrom(this.map!);
      this.currentMarker = new L.Marker(event.latlng, { icon: this.ClickIcon })
        .bindTooltip(`${event.latlng.lat}, ${event.latlng.lng}`)
        .on('dblclick', () => this.currentMarker.removeFrom(this.map!))
        .addTo(this.map!);
      this.createAddressPopup(this.currentMarker, event, true);
    });
    // const ZoomHandler = L.Handler.extend({
    //   addHooks: () => L.DomEvent.on
    // });
  }

  createMarker(latlng: L.LatLngExpression, type: MarkerType, name: string): L.Marker {
    const marker = new L.Marker(latlng, {
      alt: name,
      title: name,
      icon: L.icon({
        iconUrl: BASE_ICON_URI + MarkerSvg[type],
        iconSize: [12, 12],
        iconAnchor: [11, 11],
        className: `icon icon-${MarkerClass[type]}`
      }),

    })
      .bindTooltip(name, { permanent: true, className: `label label-${MarkerClass[type]}` });
    marker.on('click', event => {
      const popup = marker.getPopup();
      if (!popup) {
        this.createAddressPopup(marker, event);
      }
    });
    return marker;
  }

  createAddressPopup(marker: L.Marker, event: L.LeafletMouseEvent, setTooltip: boolean = false): void {
    this.backend.getAddress(event.latlng).subscribe(address => {
      const { lat, lng } = event.latlng;
      const popup = new L.Popup({
        closeButton: true,
        content: `${lng.toFixed(7)}, ${lat.toFixed(7)}<br />${address}`
      });
      marker.bindPopup(popup).togglePopup();
      if (setTooltip) {
        marker.getTooltip()?.setContent(address);
      }
    });
  }
}

//16,20
