export const getDistanceFromLocation = (provider, location) => {
  const rawCoordinates = provider.currentLocation?.coordinates || provider.location?.coordinates;
  const coordinates = Array.isArray(rawCoordinates)
    ? rawCoordinates
    : rawCoordinates?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null;

  const [longitude, latitude] = coordinates.map(Number);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  const radians = (degrees) => (degrees * Math.PI) / 180;
  const latitudeDelta = radians(latitude - location.latitude);
  const longitudeDelta = radians(longitude - location.longitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(radians(location.latitude)) *
      Math.cos(radians(latitude)) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

export const isWithinRadius = (provider, radiusKm) => {
  const distance = provider.distanceFromPickup;
  return distance != null && Number.isFinite(Number(distance)) &&
    Number(distance) >= 0 && Number(distance) <= radiusKm;
};
