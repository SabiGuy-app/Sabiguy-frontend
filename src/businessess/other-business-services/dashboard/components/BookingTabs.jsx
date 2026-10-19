import Button from "../../../../components/button";
import { bookingTabs, getBookingTab } from "../utils/bookings";

export default function BookingTabs({ bookings, selected, onChange }) {
  return (
    <div className="beauty-booking-tabs" role="group" aria-label="Filter bookings by status">
      {bookingTabs.map((tab) => (
        <Button
          key={tab.value}
          type="button"
          variant="outline"
          size="sm"
          className="beauty-booking-tab"
          aria-pressed={selected === tab.value}
          onClick={() => onChange(tab.value)}
        >
          {tab.label} ({bookings.filter((booking) => getBookingTab(booking.status) === tab.value).length})
        </Button>
      ))}
    </div>
  );
}
