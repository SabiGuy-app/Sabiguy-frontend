import React, { useState } from "react";
import { Plus, ChevronDown, Trash2 } from "lucide-react";
import FleetDashboardLayout from "../layout/FleetDashboardLayout";


const zoneTags = [
  "Bodija",
  "Ul Gate",
  "Ojoo",
  "Challenge",
  "Ring Road",
  "Agodi",
  "Mokola",
  "Dugbe",
  "Iwo Road",
];

const standardPolicy = {
  id: "standard",
  name: "Standard fleet policy",
  desc: "Default rules for all drivers and vehicles",
  rulesOn: 8,
  rulesTotal: 16,
  groups: 2,
  categories: [
    {
      name: "MONEY & REMITTANCE",
      rules: [
        {
          id: "s-min-fare",
          title: "Minimum fare floor (fuel-aware)",
          desc: "Don't dispatch trips whose fare can't cover fuel plus a margin",
          enabled: true,
          fields: [{ label: "Min fare", value: "500", unit: "₦" }],
        },
        {
          id: "s-off-app",
          title: "Off-app trip detection",
          desc: "Flag drivers with patterns suggesting off-platform (cash side) trips to dodge commission",
          enabled: false,
        },
      ],
    },
    {
      name: "VEHICLE & ROUTE",
      rules: [
        {
          id: "s-hours",
          title: "Operating hours",
          desc: "Vehicles auto-offline outside these hours",
          enabled: true,
          fields: [
            { label: "Start", value: "6" },
            { label: "End", value: "22", unit: "h" },
          ],
        },
        {
          id: "s-zones",
          title: "Zone restrictions",
          desc: "Only accept trips that start in approved zones",
          enabled: true,
          zoneTags: true,
          selectedTags: zoneTags.slice(0, 8),
        },
        {
          id: "s-okada",
          title: "Okada restricted hours",
          desc: "Bikes auto-offline during restricted-corridor / curfew hours (state okada limits)",
          enabled: false,
        },
        {
          id: "s-pickup",
          title: "Pickup distance cap",
          desc: "Don't send a driver further than this to reach a pickup (saves fuel on empty runs)",
          enabled: false,
        },
      ],
    },
    {
      name: "DRIVER QUALITY & SAFETY",
      rules: [
        {
          id: "s-online-cap",
          title: "Daily online-hours cap",
          desc: "Driver auto-offline after this many hours online (fatigue guard)",
          enabled: false,
        },
        {
          id: "s-min-rating",
          title: "Min rating",
          desc: "Driver suspended if rating falls below threshold over the window",
          enabled: true,
          fields: [
            { label: "Min rating", value: "4", unit: "★" },
            { label: "Over N trips", value: "20" },
          ],
        },
        {
          id: "s-completion",
          title: "Completion rate floor",
          desc: "Driver flagged below the completion threshold",
          enabled: true,
          fields: [{ label: "Min completion", value: "85", unit: "%" }],
        },
        {
          id: "s-1star",
          title: "Consecutive 1-star suspension",
          desc: "Driver suspended after N straight 1-star ratings",
          enabled: true,
          fields: [{ label: "Strikes", value: "3" }],
        },
        {
          id: "s-cancel",
          title: "Daily cancellation limit",
          desc: "Driver suspended after N cancellations in one day",
          enabled: true,
          fields: [{ label: "Max cancels/day", value: "5" }],
        },
        {
          id: "s-accept",
          title: "Minimum acceptance rate",
          desc: "Flag drivers who ignore too many ride requests",
          enabled: false,
        },
        {
          id: "s-highrisk",
          title: "Night high-risk zone restriction",
          desc: "Block trips into flagged high-risk zones after dark (driver safety)",
          enabled: false,
        },
        {
          id: "s-permits",
          title: "Vehicle particulars & permits",
          desc: "Block going online if roadworthiness, Hackney permit, state driver card, licence or insurance has expired",
          enabled: false,
        },
      ],
    },
  ],
};

const nightPolicy = {
  id: "night",
  name: "Night shift policy",
  desc: "Okada curfew, safety, and tighter cash control for overnight operation",
  rulesOn: 7,
  rulesTotal: 16,
  groups: 1,
  categories: [
    {
      name: "MONEY & REMITTANCE",
      rules: [
        {
          id: "n-min-fare",
          title: "Minimum fare floor (fuel-aware)",
          desc: "Don't dispatch trips whose fare can't cover fuel plus a margin",
          enabled: false,
        },
        {
          id: "n-off-app",
          title: "Off-app trip detection",
          desc: "Flag drivers with patterns suggesting off-platform (cash side) trips to dodge commission",
          enabled: false,
        },
      ],
    },
    {
      name: "VEHICLE & ROUTE",
      rules: [
        {
          id: "n-hours",
          title: "Operating hours",
          desc: "Vehicles auto-offline outside these hours",
          enabled: false,
        },
        {
          id: "n-zones",
          title: "Zone restrictions",
          desc: "Only accept trips that start in approved zones",
          enabled: false,
        },
        {
          id: "n-okada",
          title: "Okada restricted hours",
          desc: "Bikes auto-offline during restricted-corridor / curfew hours (state okada limits)",
          enabled: true,
          fields: [
            { label: "Curfew start", value: "19" },
            { label: "Curfew end", value: "6", unit: "h" },
          ],
        },
        {
          id: "n-pickup",
          title: "Pickup distance cap",
          desc: "Don't send a driver further than this to reach a pickup (saves fuel on empty runs)",
          enabled: false,
        },
      ],
    },
    {
      name: "DRIVER QUALITY & SAFETY",
      rules: [
        {
          id: "n-online-cap",
          title: "Daily online-hours cap",
          desc: "Driver auto-offline after this many hours online (fatigue guard)",
          enabled: true,
          fields: [{ label: "Max online", value: "12", unit: "h" }],
        },
        {
          id: "n-min-rating",
          title: "Min rating",
          desc: "Driver suspended if rating falls below threshold over the window",
          enabled: true,
          fields: [
            { label: "Min rating", value: "4", unit: "★" },
            { label: "Over N trips", value: "20" },
          ],
        },
        {
          id: "n-completion",
          title: "Completion rate floor",
          desc: "Driver flagged below the completion threshold",
          enabled: false,
        },
        {
          id: "n-1star",
          title: "Consecutive 1-star suspension",
          desc: "Driver suspended after N straight 1-star ratings",
          enabled: true,
          fields: [{ label: "Strikes", value: "3" }],
        },
        {
          id: "n-cancel",
          title: "Daily cancellation limit",
          desc: "Driver suspended after N cancellations in one day",
          enabled: true,
          fields: [{ label: "Max cancels/day", value: "5" }],
        },
        {
          id: "n-accept",
          title: "Minimum acceptance rate",
          desc: "Flag drivers who ignore too many ride requests",
          enabled: false,
        },
        {
          id: "n-highrisk",
          title: "Night high-risk zone restriction",
          desc: "Block trips into flagged high-risk zones after dark (driver safety)",
          enabled: true,
          fields: [{ label: "Restrict after", value: "22", unit: "h" }],
        },
        {
          id: "n-permits",
          title: "Vehicle particulars & permits",
          desc: "Block going online if roadworthiness, Hackney permit, state driver card, licence or insurance has expired",
          enabled: false,
        },
      ],
    },
  ],
};

const initialPolicies = [standardPolicy, nightPolicy];
const policyNames = initialPolicies.map((p) => p.name);


function flattenEnabled(policies) {
  const map = {};
  policies.forEach((p) =>
    p.categories.forEach((c) =>
      c.rules.forEach((r) => {
        map[r.id] = r.enabled;
      })
    )
  );
  return map;
}


function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={
        "w-[44px] h-[24px] rounded-full flex items-center px-[3px] shrink-0 transition-colors " +
        (checked ? "bg-[#1f7a4a] justify-end" : "bg-[#d1d5db] justify-start")
      }
    >
      <span className="w-[18px] h-[18px] rounded-full bg-white shadow" />
    </button>
  );
}

function FieldInput({ label, value, unit }) {
  return (
    <div className="flex items-center gap-[8px]">
      <span className="text-[13px] text-[#231F2080]">{label}</span>
      <input
        type="text"
        defaultValue={value}
        className="w-[64px] h-[32px] px-[10px] text-[13px] text-center rounded-[6px] border border-[#d1d5db] outline-none"
      />
      {unit && <span className="text-[14px] text-[#231F2080]">{unit}</span>}
    </div>
  );
}

function RuleRow({ rule, enabled, onToggle }) {
  const [selectedTags, setSelectedTags] = useState(rule.selectedTags || []);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="px-[14px] py-[10px] border-b border-[#eef0f2] last:border-b-0">
      <div className="flex items-start justify-between gap-[24px]">
        <div className="flex-1 min-w-0">
          <p className="text-[16px] font-semibold text-[#111827]">{rule.title}</p>
          <p className="text-[16px] text-[#6b7280] mt-[3px] leading-[19px]">{rule.desc}</p>

          {enabled && rule.fields && (
            <div className="flex items-center gap-[24px] mt-[12px]">
              {rule.fields.map((f) => (
                <FieldInput key={f.label} {...f} />
              ))}
            </div>
          )}

          {enabled && rule.zoneTags && (
            <div className="mt-[12px]">
              <div className="flex flex-wrap gap-[8px]">
                {zoneTags.map((tag) => {
                  const on = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={
                        "flex items-center gap-[6px] px-[12px] py-[6px] rounded-full text-[12px] font-medium " +
                        (on
                          ? "bg-[#1f7a4a] text-white"
                          : "bg-[#f3f4f6] text-[#6b7280] border border-[#e5e7eb]")
                      }
                    >
                      <span
                        className={
                          "w-[6px] h-[6px] rounded-full " +
                          (on ? "bg-white" : "bg-[#9ca3af]")
                        }
                      />
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-[8px] shrink-0">
          <Toggle checked={enabled} onChange={onToggle} />
          {enabled && rule.zoneTags && (
            <div className="flex items-center gap-[6px] text-[12px] text-[#374151] whitespace-nowrap">
              <button
                onClick={() => setSelectedTags(zoneTags)}
                className="hover:underline text-[#33794F] font-semibold"
              >
                Select all
              </button>
              ·
              <button
                onClick={() => setSelectedTags([])}
                className="hover:underline text-[#E90000] font-semibold"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PolicyCard({ policy, enabledMap, onToggleRule }) {
  return (
    <div className="bg-white rounded-[12px] border-2 border-[#005823] overflow-hidden mb-[24px]">
      <div className="flex items-start justify-between px-[14px] py-[10px] bg-[#F2FFF7]">
        <div>
          <h2 className="text-[20px] font-bold text-[#231F20] mb-[4px]">{policy.name}</h2>
          <p className="text-[13px] text-[#231F20BF]">
            {policy.desc} · {policy.rulesOn} of {policy.rulesTotal} rules on · linked to{" "}
            {policy.groups} group(s)
          </p>
        </div>
        <button className="flex items-center gap-[6px] h-[34px] px-[16px] rounded-[6px] border border-[#E9000080]/50 text-[13px] font-semibold text-[#E90000] shrink-0">
          <Trash2 size={14} />
          Delete
        </button>
      </div>

      {policy.categories.map((cat) => (
        <div key={cat.name}>
          <div className="px-[14px] py-[10px] bg-[#fafbfc] border-y border-[#eef0f2]">
            <p className="text-[14px] tracking-[0.6px] font-bold text-[#005823]">{cat.name}</p>
          </div>
          {cat.rules.map((rule) => (
            <RuleRow
              key={rule.id}
              rule={rule}
              enabled={enabledMap[rule.id]}
              onToggle={() => onToggleRule(rule.id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}


export default function PoliciesPage() {
  const [enabledMap, setEnabledMap] = useState(() => flattenEnabled(initialPolicies));
  const [activePolicy, setActivePolicy] = useState(standardPolicy.name);

  const toggleRule = (id) => {
    setEnabledMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <FleetDashboardLayout className="bg-[#f5f6f8] min-h-screen">
      <div>
        <div className="flex items-start justify-between mb-[24px]">
          <div>
            <h1 className="text-[24px] font-semibold text-[#231F20] mb-[6px]">Policies</h1>
            <p className="text-[16px] text-[#231F20BF]">
              Each policy is a set of rules. Link a policy to a group, and choose which one the
              live simulation enforces.
            </p>
          </div>
          <button className="flex items-center gap-[8px] h-[40px] px-[18px] rounded-[6px] bg-[#33794F] text-white text-[14px] font-semibold shrink-0">
            <Plus size={16} />
            New Policy
          </button>
        </div>

        <div className="flex items-center justify-between bg-[#eefaf1] border border-[#005823BF] rounded-[10px] px-[20px] py-[16px] mb-[28px]">
          <div>
            <p className="text-[12px] font-semibold text-[#1f7a4a]">Active enforcement policy</p>
            <p className="text-[12px] text-[#4b7a63] mt-[2px]">
              This is the policy the live simulation enforces right now
            </p>
          </div>
          <div className="relative">
            <select
              value={activePolicy}
              onChange={(e) => setActivePolicy(e.target.value)}
              className="appearance-none h-[38px] pl-[14px] pr-[34px] text-[12px] font-medium rounded-[6px] border-2 border-[#33794F] bg-[#F2FFF7] text-[#33794F] outline-none"
            >
              {policyNames.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2"
              color="#6b7280"
            />
          </div>
        </div>

        {initialPolicies.map((policy) => (
          <PolicyCard
            key={policy.id}
            policy={policy}
            enabledMap={enabledMap}
            onToggleRule={toggleRule}
          />
        ))}
      </div>
    </FleetDashboardLayout>
  );
}