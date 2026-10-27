import { BadgeCheck, MapPin, Star } from "../icons";

export default function BookingCustomer({ booking }) {
  const profile = booking.customerProfile ?? {};
  return (
    <div className="beauty-booking-customer">
      <img src={profile.avatar || "/avatar.png"} alt="" />
      <div>
        <h3>{booking.customer}{profile.verified && <BadgeCheck size={15} aria-label="Verified customer" />}</h3>
        {Number.isFinite(profile.rating) && <p><Star className="beauty-booking-star" size={15} /><span>{profile.rating} <span className="beauty-booking-muted">({profile.reviewCount ?? 0} reviews)</span></span></p>}
        {profile.location && <p className="beauty-booking-muted"><MapPin size={14} />{profile.location}</p>}
      </div>
    </div>
  );
}
