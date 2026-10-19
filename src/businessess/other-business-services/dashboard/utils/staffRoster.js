const workingStatuses = ["assigned", "scheduled", "en_route", "in_service"];

export function createStaffRoster(sessions) {
  return [...new Map(sessions.map(({ booking, staff }) => [staff.id, {
    ...staff,
    status: booking.status === "scheduled" ? "available" : staff.status,
    assignedBookingId: booking.assignedStaff?.id === staff.id && workingStatuses.includes(booking.status) ? booking.id : null,
  }])).values()];
}

export function syncStaffRoster(roster, previous, next) {
  if (previous.booking === next.booking) return roster;
  const oldStaffId = previous.booking.assignedStaff?.id;
  const nextStaffId = next.booking.assignedStaff?.id;
  return roster.map((member) => {
    if (oldStaffId && oldStaffId !== nextStaffId && member.id === oldStaffId && member.assignedBookingId === previous.booking.id) {
      return { ...member, status: "available", service: null, customer: null, assignedBookingId: null };
    }
    if (member.id !== next.staff.id) return member;
    return {
      ...member,
      ...next.staff,
      status: nextStaffId === member.id && workingStatuses.includes(next.booking.status)
        ? next.booking.status === "scheduled" ? "available" : next.booking.status
        : next.staff.status,
      assignedBookingId: workingStatuses.includes(next.booking.status) && nextStaffId === member.id
        ? next.booking.id
        : next.staff.status === "available" ? null : member.assignedBookingId,
    };
  });
}
