import { useState } from "react";
import { Plus, UserRound } from "lucide-react";
import SettingsCard from "./SettingsCard";
import SettingsBadge from "./SettingsBadge";
import InviteMemberModal from "./InviteMemberModal";
import { mockTeamMembers, TEAM_ROLES } from "../data/mockSettings";

function MemberAvatar({ avatar }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#ECECEC]">
      {avatar ? (
        <img src={avatar} alt="" className="h-full w-full object-cover" />
      ) : (
        <UserRound size={28} className="translate-y-1 text-[#6B6B6B]" />
      )}
    </div>
  );
}

export default function TeamSettingsTab() {
  const [members, setMembers] = useState(mockTeamMembers);
  const [inviteOpen, setInviteOpen] = useState(false);

  const updateRole = (id, role) => {
    setMembers((current) => current.map((member) => (member.id === id ? { ...member, role } : member)));
  };

  const removeMember = (id) => {
    setMembers((current) => current.filter((member) => member.id !== id));
  };

  const inviteMember = (form) => {
    setMembers((current) => [
      ...current,
      { id: `member-${Date.now()}`, name: form.name, email: form.email, role: form.role, avatar: "", editable: true },
    ]);
    setInviteOpen(false);
  };

  return (
    <div>
      <SettingsCard
        title="Team & roles"
        headerRight={
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#2F7D55] px-3.5 py-1.5 text-sm font-medium text-white hover:bg-[#256846]"
          >
            <Plus size={16} />
            Invite Member
          </button>
        }
      >
        <div className="-mx-5 divide-y divide-[#EFEDED] sm:-mx-6">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between gap-4 px-5 py-3 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <MemberAvatar avatar={member.avatar} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#231F20]">{member.name}</p>
                  <p className="truncate text-xs text-[#918E8F]">{member.email}</p>
                </div>
              </div>

              {member.editable ? (
                <div className="flex shrink-0 items-center gap-2">
                  <select
                    value={member.role}
                    onChange={(event) => updateRole(member.id, event.target.value)}
                    className="appearance-none rounded-md border border-[#CFCBCC] bg-white px-3 py-1.5 text-sm text-[#3D393A] outline-none focus:border-[#2F7D55]"
                  >
                    {TEAM_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeMember(member.id)}
                    className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <SettingsBadge tone="neutral">{member.role}</SettingsBadge>
              )}
            </div>
          ))}
        </div>

        <p className="pt-1 text-xs text-[#918E8F]">
          <span className="font-semibold text-[#5F5C5D]">Manager</span> runs drivers, vehicles & trips ·{" "}
          <span className="font-semibold text-[#5F5C5D]">Accountant</span> sees earnings & payouts ·{" "}
          <span className="font-semibold text-[#5F5C5D]">Viewer</span> read-only ·{" "}
          <span className="font-semibold text-[#5F5C5D]">Owner</span> full access including policies.
        </p>
      </SettingsCard>

      <InviteMemberModal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} onInvite={inviteMember} />
    </div>
  );
}
