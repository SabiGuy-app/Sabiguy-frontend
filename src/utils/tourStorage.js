export function claimFirstTourVisit(storage, key) {
  if (storage.getItem(key)) return false;
  // Record the first display even if the user leaves before finishing the tour.
  storage.setItem(key, "true");
  return true;
}

export function clearStoragePreservingTours(storage) {
  const tours = Object.keys(storage)
    .filter((key) => key.startsWith("tourSeen_") || key.startsWith("bookingTourSeen_"))
    .map((key) => [key, storage.getItem(key)]);
  storage.clear();
  tours.forEach(([key, value]) => storage.setItem(key, value));
}
