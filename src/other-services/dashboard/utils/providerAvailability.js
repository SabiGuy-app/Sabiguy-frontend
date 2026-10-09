export const isDiscoverableProvider = (provider) =>
  provider.availability?.isAvailable === true && provider.locationFresh !== false;

export const mergeProviderAvailability = (first, second) => {
  const firstAvailable = first.availability?.isAvailable;
  const secondAvailable = second.availability?.isAvailable;
  const isAvailable =
    firstAvailable === false || secondAvailable === false
      ? false
      : firstAvailable ?? secondAvailable;

  return {
    availability:
      isAvailable === undefined
        ? undefined
        : { ...first.availability, ...second.availability, isAvailable },
    locationFresh:
      first.locationFresh === false || second.locationFresh === false
        ? false
        : second.locationFresh ?? first.locationFresh,
  };
};
