import { useState } from "react";
import { MoreHorizontal, UserPlus } from "lucide-react";
import FleetDashboardLayout from "../layout/FleetDashboardLayout";
import AddStaffModal from "../components/AddStaffModal";
import StaffDetailsModal from "../components/StaffDetailsModal";

const initialStaff = [
  {
    id: "staff-1",
    staffId: "SGD-284961",
    name: "Tunde Adeyemi",
    role: "Barber",
    completed: 24,
    rating: "4.9",
    joined: "Oct 10, 2025",
    status: "Available",
    initials: "TA",
    avatar: "bg-[#D9E9E4] text-[#27634C]",
    services: ["Haircut", "Kids cut", "Shape-up"],
  },
  {
    id: "invite-1",
    staffId: "SGD-284964",
    name: "SGD-284964",
    status: "Pending signup",
    pending: true,
  },
];

const StaffPage = () => {
  const [staff, setStaff] = useState(initialStaff);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const sendInvite = ({ staffId, role, services }) => {
    setStaff((current) => [
      ...current,
      {
        id: `invite-${Date.now()}`,
        staffId,
        name: staffId,
        role,
        status: "Pending signup",
        pending: true,
        services,
      },
    ]);
  };

  const handleStaffAction = (member, action) => {
    if (action === "Remove") {
      setStaff((current) => current.filter((item) => item.id !== member.id));
    } else {
      setStaff((current) =>
        current.map((item) =>
          item.id === member.id
            ? {
                ...item,
                status: action === "Suspend" ? "Suspended" : "Available",
              }
            : item,
        ),
      );
    }
    setActiveMenu(null);
  };

  return (
    <FleetDashboardLayout>
      <section className="min-h-[calc(100vh-8rem)] text-[#242424] xl:min-h-[calc(100vh-9rem)]">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold leading-7">Staff</h1>
            <p className="mt-1 text-xs text-[#777777] sm:text-sm">
              Your team, their status, skills and track record
            </p>
          </div>
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-[#347B54] px-3 text-xs font-medium text-white transition-colors hover:bg-[#286642] focus:outline-none focus:ring-2 focus:ring-[#347B54] focus:ring-offset-2"
          >
            <UserPlus size={14} aria-hidden="true" />
            Add staff
          </button>
        </div>

        <div className="max-h-[calc(100vh-12rem)] overflow-auto rounded-[9px] border border-[#E7E7E7] bg-white">
          <table className="w-full min-w-170 border-collapse text-left text-[11px] sm:text-xs">
            <thead className="sticky top-0 z-10 bg-[#FCFCFC] text-[#505050]">
              <tr className="h-8 border-b border-[#EEEEEE]">
                <th scope="col" className="w-[21%] px-3 font-medium sm:px-4">
                  Staff
                </th>
                <th scope="col" className="w-[19%] px-3 font-medium">
                  Completed Job
                </th>
                <th scope="col" className="w-[14%] px-3 font-medium">
                  Rating
                </th>
                <th scope="col" className="w-[20%] px-3 font-medium">
                  Joined date
                </th>
                <th scope="col" className="w-[17%] px-3 font-medium">
                  Status
                </th>
                <th scope="col" className="w-[9%] px-3 text-center font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr
                  key={member.id}
                  className={`${member.pending ? "h-14" : "h-11"} border-b border-[#F0F0F0] last:border-b-0`}
                >
                  <td className="px-3 sm:px-4">
                    <div className="flex items-center gap-2">
                      {member.pending ? (
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E9E9E9] text-[#6C6C6C]">
                          <span className="h-2 w-2 rounded-full bg-[#777777]" />
                        </span>
                      ) : (
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold ${member.avatar}`}
                        >
                          {member.initials}
                        </span>
                      )}
                      {member.pending ? (
                        <span className="font-medium text-[#222222]">
                          {member.name}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedStaff(member)}
                          className="font-medium text-[#222222] hover:underline focus:outline-none focus:underline"
                        >
                          {member.name}
                        </button>
                      )}
                    </div>
                    {member.pending && (
                      <span className="ml-8 block text-[10px] leading-3 text-[#858585]">
                        Pending Invite
                      </span>
                    )}
                  </td>
                  <td className="px-3 text-[#333333]">
                    {member.pending ? "" : member.completed}
                  </td>
                  <td className="px-3 text-[#333333]">
                    {member.pending ? (
                      ""
                    ) : (
                      <>
                        {member.rating}
                        <span aria-label="stars">★</span>
                      </>
                    )}
                  </td>
                  <td className="px-3 text-[#333333]">
                    {member.pending ? "" : member.joined}
                  </td>
                  <td className="px-3">
                    <span
                      className={`inline-flex whitespace-nowrap rounded-full px-2 py-0.75 text-[10px] leading-none ${
                        member.status === "Available"
                          ? "bg-[#18C84D] text-white"
                          : member.status === "Offline"
                            ? "bg-[#E8ECE9] text-[#626A64]"
                            : member.status === "Suspended"
                              ? "bg-[#FDE2E2] text-[#9B3030]"
                              : "bg-[#FFF0C2] text-[#8B5A00]"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="relative px-3 text-center">
                    <button
                      type="button"
                      aria-label={`Actions for ${member.name}`}
                      aria-expanded={activeMenu?.id === member.id}
                      onClick={(event) => {
                        if (activeMenu?.id === member.id) {
                          setActiveMenu(null);
                          return;
                        }
                        const bounds =
                          event.currentTarget.getBoundingClientRect();
                        const menuHeight = member.pending ? 36 : 72;
                        const menuTop =
                          bounds.bottom + menuHeight > window.innerHeight
                            ? bounds.top - menuHeight - 4
                            : bounds.bottom + 4;
                        setActiveMenu({
                          id: member.id,
                          top: menuTop,
                          left: Math.max(8, bounds.right - 128),
                        });
                      }}
                      className="rounded p-1 text-[#777777] hover:bg-[#F3F3F3] focus:outline-none focus:ring-2 focus:ring-[#347B54]"
                    >
                      <MoreHorizontal size={15} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {activeMenu && staff.some((member) => member.id === activeMenu.id) && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setActiveMenu(null)}
          >
            {staff
              .filter((member) => member.id === activeMenu.id)
              .map((member) => (
                <div
                  key={member.id}
                  className="fixed z-50 w-32 rounded-md border border-[#E7E7E7] bg-white py-1 text-left shadow-lg"
                  style={{ top: activeMenu.top, left: activeMenu.left }}
                  onClick={(event) => event.stopPropagation()}
                >
                  {member.pending ? (
                    <button
                      type="button"
                      onClick={() => handleStaffAction(member, "Remove")}
                      className="w-full px-3 py-2 text-[11px] text-[#444444] hover:bg-[#F5F7F5]"
                    >
                      Remove invite
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleStaffAction(member, "Reinstate")}
                        className="w-full px-3 py-2 text-left text-[11px] text-[#444444] hover:bg-[#F5F7F5]"
                      >
                        Reinstate
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStaffAction(member, "Suspend")}
                        className="w-full px-3 py-2 text-left text-[11px] text-[#444444] hover:bg-[#F5F7F5]"
                      >
                        Suspend
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStaffAction(member, "Remove")}
                        className="w-full px-3 py-2 text-left text-[11px] text-[#A33A3A] hover:bg-[#FFF5F5]"
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              ))}
          </div>
        )}
      </section>

      <AddStaffModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSubmit={sendInvite}
      />

      {selectedStaff && (
        <StaffDetailsModal
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
        />
      )}
    </FleetDashboardLayout>
  );
};

export default StaffPage;
