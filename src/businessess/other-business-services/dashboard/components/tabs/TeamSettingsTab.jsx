import { useState } from "react";
import { Plus, Trash2, UserRound } from "lucide-react";
import tundeAvatar from "../../../../../assets/tunde.png";
import emekaAvatar from "../../../../../assets/emeka.png";
import SettingsTabCard, { SettingsEditDialog } from "./SettingsTabCard";

const initialTeam = [
  {
    id: "owner",
    name: "Adewale Okonkwo",
    email: "adewale@adewalefleet.ng",
    role: "Owner",
    avatar: tundeAvatar,
  },
  {
    id: "stylist",
    name: "Bisi Adeyemi",
    email: "bisi@adewalefleet.ng",
    role: "Manager",
    avatar: emekaAvatar,
  },
];

export default function TeamSettingsTab() {
  const [members, setMembers] = useState(initialTeam);
  const [inviteOpen, setInviteOpen] = useState(false);

  const inviteMember = ({ name, email, role }) => {
    setMembers((current) => [
      ...current,
      { id: `member-${Date.now()}`, name, email, role },
    ]);
    setInviteOpen(false);
  };

  const updateRole = (id, role) => {
    setMembers((current) =>
      current.map((member) =>
        member.id === id ? { ...member, role } : member,
      ),
    );
  };

  const removeMember = (id) => {
    setMembers((current) => current.filter((member) => member.id !== id));
  };

  return (
    <div className="py-1">
      <SettingsTabCard
        title="Team & roles"
        headerRight={
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="inline-flex items-center gap-1 rounded-md bg-[#347B54] px-3 py-2 text-[10px] font-medium text-white hover:bg-[#286642]"
          >
            <Plus size={13} />
            Invite Member
          </button>
        }
      >
        <div className="divide-y divide-[#EFEFEF]">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between gap-3 py-2.5 sm:py-3"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E9EFEB] text-[#347B54]">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt=""
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <UserRound size={17} />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium text-[#292929]">
                    {member.name}
                  </p>
                  <p className="truncate text-[9px] text-[#858585]">
                    {member.email}
                  </p>
                </div>
              </div>
              {member.role === "Owner" ? (
                <span className="shrink-0 rounded-full bg-[#F1F1F1] px-2 py-1 text-[9px] text-[#5F5C5D]">
                  Owner
                </span>
              ) : (
                <div className="flex shrink-0 items-center gap-2">
                  <select
                    value={member.role}
                    onChange={(event) =>
                      updateRole(member.id, event.target.value)
                    }
                    aria-label={`Role for ${member.name}`}
                    className="h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs text-[#555555] outline-none focus:border-[#347B54]"
                  >
                    {[
                      "Manager",
                      "Accountant",
                      "Viewer",
                      "Barber",
                      "Stylist",
                      "Receptionist",
                    ].map((role) => (
                      <option key={role}>{role}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeMember(member.id)}
                    className="h-9 rounded-md border border-[#F2A3A3] px-4 text-xs font-medium text-[#E24747] hover:bg-[#FFF5F5]"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="-mx-3 -mb-2.5 mt-1 border-t border-[#EEEEEE] bg-[#FCFCFC] px-3 py-3 text-[10px] leading-5 text-[#898989] sm:-mx-3.5 sm:px-3.5">
          <span className="font-semibold text-[#777777]">Manager</span> runs
          drivers, vehicles &amp; trips ·{" "}
          <span className="font-semibold text-[#777777]">Accountant</span> sees
          earnings &amp; payouts ·{" "}
          <span className="font-semibold text-[#777777]">Viewer</span> read-only
          · <span className="font-semibold text-[#777777]">Owner</span> full
          access including policies.
        </div>
      </SettingsTabCard>
      <SettingsEditDialog
        isOpen={inviteOpen}
        title="Invite team member"
        fields={[
          { key: "name", label: "Full name" },
          { key: "email", label: "Email address", type: "email" },
          {
            key: "role",
            label: "Role",
            type: "select",
            options: ["Manager", "Barber", "Stylist", "Receptionist"],
          },
        ]}
        values={{ name: "", email: "", role: "Barber" }}
        onClose={() => setInviteOpen(false)}
        onSave={inviteMember}
      />
    </div>
  );
}
