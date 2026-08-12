import React, { useState } from "react";
import {
  Info,
  Plus,
  Users,
  Pencil,
  Trash2,
  ChevronDown,
  User,
  Car,
  X,
} from "lucide-react";
import FleetDashboardLayout from "../layout/FleetDashboardLayout";
import NewGroupModal, { policyOptions } from "../components/NewGroupModal";


const groups = [
  {
    id: 1,
    name: "Motorbike fleet",
    subtitle: "All okada / dispatch bikes · vehicles",
    members: 2,
    policy: "Night shift policy",
    rules: "7 rules active",
    iconBg: "#fdecea",
    iconColor: "#e05b3f",
    icon: "bike",
  },
  {
    id: 2,
    name: "Car Fleet",
    subtitle: "Ride-hailing cars · Vehicles",
    members: 3,
    policy: "Standard fleet policy",
    rules: "7 rules active",
    iconBg: "#fdecea",
    iconColor: "#e05b3f",
    icon: "car",
  },
  {
    id: 3,
    name: "Core drivers",
    subtitle: "Full-time verified drivers · drivers",
    members: 2,
    policy: "Standard fleet policy",
    rules: "7 rules active",
    iconBg: "#f1f2f4",
    iconColor: "#6b7280",
    icon: "user",
  },
];

function BikeIcon({ color, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
    >
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path
        d="M5.5 17.5L9 10h5l3 4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 10L11 6h3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 17.5h6.5" strokeLinecap="round" />
    </svg>
  );
}

function CarIcon({ color, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
    >
      <path
        d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="2.5" y="13" width="19" height="5" rx="1.5" />
      <circle cx="7" cy="18.5" r="1.6" />
      <circle cx="17" cy="18.5" r="1.6" />
    </svg>
  );
}

function GroupIcon({ type, color }) {
  if (type === "bike") return <BikeIcon color={color} />;
  if (type === "car") return <CarIcon color={color} />;
  return <User size={18} color={color} />;
}


function GroupRow({ group, isLast }) {
  const [policy, setPolicy] = useState(group.policy);

  return (
    <div
      className={
        "flex items-center justify-between px-[14px] py-[14px] " +
        (isLast ? "" : "border-b border-[#231F2020]")
      }
    >
      <div className="flex items-center gap-[14px] w-[300px] shrink-0">
        <span
          className="w-[38px] h-[38px] rounded-[8px] flex items-center justify-center shrink-0"
          style={{ backgroundColor: group.iconBg }}
        >
          <GroupIcon type={group.icon} color={group.iconColor} />
        </span>
        <div>
          <p className="text-[14px] font-bold text-[#111827]">{group.name}</p>
          <p className="text-[13px] text-[#6b7280] mt-[2px]">
            {group.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-[6px] w-[70px] shrink-0 text-[#374151]">
        <Users size={15} color="#6b7280" />
        <span className="text-[14px] font-medium">{group.members}</span>
      </div>

      <div className="w-[220px] shrink-0">
        <p className="text-[11px] tracking-[0.5px] text-[#9ca3af] font-semibold mb-[4px]">
          LINKED POLICY
        </p>
        <div className="relative">
          <select
            value={policy}
            onChange={(e) => setPolicy(e.target.value)}
            className="appearance-none w-full h-[36px] pl-[12px] pr-[30px] text-[13px] rounded-[6px] border border-[#d1d5db] outline-none bg-white text-[#111827]"
          >
            {policyOptions.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-[10px] top-1/2 -translate-y-1/2"
            color="#6b7280"
          />
        </div>
        <p className="text-[12px] text-[#9ca3af] mt-[4px]">{group.rules}</p>
      </div>

      <div className="flex items-center gap-[14px] shrink-0">
        <button className="w-[32px] h-[32px] rounded-[6px] flex items-center justify-center hover:bg-[#f3f4f6]">
          <Pencil size={16} color="#6b7280" />
        </button>
        <button className="w-[32px] h-[32px] rounded-[6px] flex items-center justify-center hover:bg-[#fdecea]">
          <Trash2 size={16} color="#dc4c3f" />
        </button>
      </div>
    </div>
  );
}

function GroupsPage({ onAddGroup }) {
  return (
    <FleetDashboardLayout className="bg-[#f5f6f8] min-h-screen">
      <div>
        <h1 className="text-[24px] font-semibold text-[#231F20] mb-[6px]">
          Groups
        </h1>
        <p className="text-[16px] text-[#231F20BF] mb-[24px]">
          Organise drivers or vehicles into groups, the linked policy applies to
          everyone in it
        </p>

        <div className="flex gap-[12px] bg-[#eefaf1] border border-[#005823BF] rounded-[8px] px-[18px] py-[14px] mb-[28px]">
          <Info size={18} color="#1f7a4a" className="shrink-0 mt-[2px]" />
          <p className="text-[14px] leading-[20px] text-[#33794F]">
            Group policies now drive enforcement directly. A driver is governed
            by their <span className="font-bold">driver group's</span> policy
            first, then their <span className="font-bold">vehicle group's</span>
            , falling back to the active policy. Bikes follow the Motorbike
            fleet policy, cars the Car fleet policy.
          </p>
        </div>

        <div className="bg-white p-10 rounded-[10px] border border-[#231F2026] overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-[20px] font-bold text-[#231F20]">All Groups</h2>
            <button
              onClick={onAddGroup}
              className="flex items-center gap-[4px] h-[38px] px-[8px] rounded-[4px] bg-[#33794F] text-white text-[12px] font-semibold"
            >
              <Plus size={15} />
              Add Group
            </button>
          </div>

          <div className="border border-[#231F2026] rounded-[10px] overflow-hidden">
            {groups.map((g, i) => (
              <GroupRow key={g.id} group={g} isLast={i === groups.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </FleetDashboardLayout>
  );
}



export default function GroupsManagement() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <GroupsPage onAddGroup={() => setShowModal(true)} />
      {showModal && <NewGroupModal onClose={() => setShowModal(false)} />}
    </>
  );
}
