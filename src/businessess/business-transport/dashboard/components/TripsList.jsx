import TripListItem from "./TripListItem";

export default function TripsList({ trips = [], onTripClick }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-4 py-3 sm:px-5">
        <p className="text-sm text-gray-500">Tap a trip for details</p>
      </div>

      {trips.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-gray-500">
          No trips match this filter
        </p>
      ) : (
        <div className="divide-y divide-gray-100">
          {trips.map((trip) => (
            <TripListItem key={trip.id} trip={trip} onClick={onTripClick} />
          ))}
        </div>
      )}
    </div>
  );
}
