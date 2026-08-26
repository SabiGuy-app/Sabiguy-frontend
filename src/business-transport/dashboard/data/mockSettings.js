export const mockBusinessProfile = {
  businessName: "Adewale Fleet Services",
  owner: "Adewale Okonkwo",
  city: "Ibadan",
};

export const mockOperatingDefaults = {
  city: "Ibadan",
  currency: "NGN (₦)",
  timezone: "WAT (GMT+1)",
  weekStarts: "Monday",
};

export const mockPayoutAccount = {
  account: "GTBank ****6789",
  bank: "GTBank",
  taxId: "12345678-0001",
  verification: "Verified",
};

export const mockPayoutSchedule = {
  automaticPayouts: true,
  automaticPayoutsNote: "Runs every Friday",
  minimumThreshold: 5000,
  minimumThresholdNote: "Drivers below the threshold roll over to the next run.",
};

export const mockTeamMembers = [
  {
    id: "member-1",
    name: "Adewale Okonkwo",
    email: "adewale@adewalefleet.ng",
    avatar: "",
    role: "Owner",
    editable: false,
  },
  {
    id: "member-2",
    name: "Bisi Adeyemi",
    email: "bisi@adewalefleet.ng",
    avatar: "",
    role: "Manager",
    editable: true,
  },
];

export const TEAM_ROLES = ["Manager", "Accountant", "Viewer"];

export const mockNotificationPrefs = [
  {
    key: "payout-failed",
    title: "Payout failed",
    description: "A transfer to a driver didn't go through",
    inApp: true,
    sms: true,
    email: false,
  },
  {
    key: "document-expiring",
    title: "Document expiring",
    description: "A licence, insurance or permit is near expiry",
    inApp: true,
    sms: true,
    email: false,
  },
  {
    key: "driver-suspended",
    title: "Driver suspended",
    description: "A policy automatically suspended a driver",
    inApp: true,
    sms: false,
    email: false,
  },
  {
    key: "low-rating",
    title: "Low rating received",
    description: "A driver got a 1–2★ trip rating",
    inApp: true,
    sms: false,
    email: false,
  },
  {
    key: "demand-surge",
    title: "Demand surge",
    description: "A zone is heating up and needs drivers",
    inApp: true,
    sms: false,
    email: false,
  },
  {
    key: "daily-summary",
    title: "Daily summary",
    description: "End-of-day earnings and activity recap",
    inApp: false,
    sms: false,
    email: true,
  },
];

export const mockAccountSecurity = {
  language: "English",
};

export const mockBilling = {
  plan: "Growth plan",
  platformFeeRate: "10% of fares",
  platformFeeOwed: 2377,
  invoices: [
    { id: "inv-1", period: "May 2026", amount: 28400, status: "Paid" },
    { id: "inv-2", period: "Apr 2026", amount: 24100, status: "Paid" },
    { id: "inv-3", period: "Mar 2026", amount: 19800, status: "Paid" },
  ],
};

export const mockAuditLog = [
  {
    id: "audit-1",
    description: "Changed default income split to 63/27/10 (%)",
    actor: "Adewale Okonkwo",
    when: "Today · 9:02 AM",
  },
  {
    id: "audit-2",
    description: "Reinstated driver Emeka Obi",
    actor: "Bisi Adeyemi",
    when: "Yesterday · 4:30 PM",
  },
  {
    id: "audit-3",
    description: "Set Standard fleet policy as active",
    actor: "Adewale Okonkwo",
    when: "Mon 9 Jun · 11:15 AM",
  },
];

export const mockSettings = {
  business: mockBusinessProfile,
  operatingDefaults: mockOperatingDefaults,
  payoutAccount: mockPayoutAccount,
  payoutSchedule: mockPayoutSchedule,
};

export default mockSettings;
