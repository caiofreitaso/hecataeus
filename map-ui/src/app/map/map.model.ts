export interface Dictionary<T> {
  [key: string]: T;
}

export interface MapState {
  coords: [number, number];
  zoom: number;
}

export enum MarkerType {
  Amenity,
  Office,
  Religion,
  Shop,
  Tourism,
  Favorite,
}

export const MarkerClass: Dictionary<string> = {
  [MarkerType.Amenity]: 'amenity',
  [MarkerType.Office]: 'office',
  [MarkerType.Religion]: 'religion',
  [MarkerType.Shop]: 'shop',
  [MarkerType.Tourism]: 'tourism',
  [MarkerType.Favorite]: 'saved',
}

export const MarkerSvg: Dictionary<string> = {
  [MarkerType.Amenity]: 'amenity/cafe.svg',
  [MarkerType.Favorite]: 'tourism/guest_house.svg',
}
