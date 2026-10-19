import { Anchor, Banknote, CalendarDays, Clock, MapPin, Wrench } from "../icons";
import { formatNaira } from "../utils/format";
import { formatBookingStart } from "../utils/bookings";

export default function BookingInformation({ booking }) {
  const hours = Math.floor(booking.durationMinutes / 60);
  const minutes = booking.durationMinutes % 60;
  const duration = [hours ? `${hours} ${hours === 1 ? "hour" : "hours"}` : "", minutes ? `${minutes} min` : ""].filter(Boolean).join(" ") || "Not specified";
  const fields = [
    { label: "Service", value: booking.service, icon: Wrench },
    { label: "Service Location", value: booking.serviceLocation === "in_salon" ? "Walk in salon" : "Customer’s Address", icon: Anchor },
    { label: "Start Date & Time", value: formatBookingStart(booking.startsAt), icon: CalendarDays },
    { label: "Duration", value: duration, icon: Clock },
    { label: "Location", value: booking.address, icon: MapPin },
    { label: "Service Cost", value: formatNaira(booking.amount), icon: Banknote },
  ];
  return (
    <dl className="beauty-booking-information">
      {fields.map((field) => {
        const Icon = field.icon;
        return <div key={field.label}><Icon size={20} strokeWidth={1.7} /><div><dt>{field.label}</dt><dd>{field.value}</dd></div></div>;
      })}
    </dl>
  );
}
