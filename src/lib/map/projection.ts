export type BBox = { west: number; south: number; east: number; north: number };

export const WORLD_BBOX: BBox = { west: -180, south: -90, east: 180, north: 90 };
export const EUROPE_BBOX: BBox = { west: -12, south: 34, east: 42, north: 72 };

export function project(
  lon: number,
  lat: number,
  width: number,
  height: number,
  bbox: BBox = WORLD_BBOX,
): { x: number; y: number } {
  const x = ((lon - bbox.west) / (bbox.east - bbox.west)) * width;
  const y = ((bbox.north - lat) / (bbox.north - bbox.south)) * height;
  return { x, y };
}

export function unproject(
  x: number,
  y: number,
  width: number,
  height: number,
  bbox: BBox = WORLD_BBOX,
): { lon: number; lat: number } {
  const lon = bbox.west + (x / width) * (bbox.east - bbox.west);
  const lat = bbox.north - (y / height) * (bbox.north - bbox.south);
  return { lon, lat };
}

export function inBBox(lon: number, lat: number, bbox: BBox) {
  return lon >= bbox.west && lon <= bbox.east && lat >= bbox.south && lat <= bbox.north;
}
