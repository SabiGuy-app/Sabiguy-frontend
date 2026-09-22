import ShoppingBag from "../../../assets/streamline-ultimate-color_shopping-bag-check.svg";
import MoneyIcon from "../../../assets/noto_money-with-wings.svg";

// ===============================
// Earnings Summary
// ===============================

const earningsSummary = {
  period: "Wed, 8 Jul",
  grossEarnings: 37279,
  trips: 48,
  cancelledTrips: 19,
  averagePerTrip: 777,
};

// ===============================
// Wallet
// ===============================

const walletData = {
  companyWallet: 94000,
  owedToDrivers: 50546,
  processing: 0,
};

// ===============================
// Recent Days Income
// ===============================

const recentDaysIncome = [
  {
    day: "Thu, 2 Jul",
    amount: 18000,
    trips: 2,
    percentage: 27,
  },
  {
    day: "Fri, 3 Jul",
    amount: 32000,
    trips: 3,
    percentage: 71,
  },
  {
    day: "Sat, 4 Jul",
    amount: 51000,
    trips: 4,
    percentage: 112,
  },
  {
    day: "Sun, 5 Jul",
    amount: 72000,
    trips: 5,
    percentage: 153,
  },
  {
    day: "Mon, 6 Jul",
    amount: 55100,
    trips: 3,
    percentage: 61,
  },
  {
    day: "Tue, 7 Jul",
    amount: 51000,
    trips: 3,
    percentage: 112,
  },
  {
    day: "Wed, 8 Jul",
    amount: 27000,
    trips: 2,
    percentage: 34,
  },
];

// ===============================
// Payment Warning
// ===============================

const paymentWarning = {
  affectedDrivers: 1,
  message: "can't be paid — no payout destination set",
  name: "Fatima Kuti",
};

// ===============================
// Driver Balances
// ===============================

const driverBalances = [
  {
    id: "DRV-001",
    img: "/src/assets/tunde.png",
    name: "Tunde Adeyemi",
    bank: "GTBank",
    accountNumber: "****3210",
    earningsPercentage: 63,
    balance: 50546,
    status: "unpaid",
    payoutAvailable: true,
  },

  {
    id: "DRV-002",
    img: "/src/assets/emeka.png",
    name: "Emeka Obi",
    bank: "OPay",
    accountNumber: "****1144",
    earningsPercentage: 63,
    balance: 23676,
    status: "unpaid",
    payoutAvailable: true,
  },

  {
    id: "DRV-003",
    name: "Emeka Obi",
    img: "/src/assets/emeka.png",
    bank: null,
    accountNumber: null,
    earningsPercentage: 63,
    balance: 23676,
    status: "unpaid",
    payoutAvailable: false,
  },
];

// ===============================
// Reconciliation
// ===============================

const reconciliationData = {
  sumOfDriverBalances: 49398,
  processing: 0,
  totalLiabilityToDrivers: 49398,
  companyWalletBalance: 50879,
  companyFundsAvailableToWithdraw: 1481,
};

// ===============================
// Wallet Statistics
// ===============================

const walletStats = [
  {
    label: "WALLET BALANCE",
    amount: 50546,
    type: "balance",
  },
  {
    label: "LEDGER ENTRIES",
    number: 18,
    type: "entries",
  },
  {
    label: "IN (COMMISSIONS)",
    amount: 3825,
    type: "income",
  },
  {
    label: "OUT (PAID)",
    amount: 11592,
    type: "outgoing",
  },
];

// ===============================
// Company Wallet Ledger
// ===============================

const walletLedger = [
  {
    id: "CM-C6WC2G-1",
    type: "Commission",
    method: "digital",
    icon: ShoppingBag,
    name: "Tunde Mokola",
    driverTo: "Dugbe",
    reference: "CM-C6WC2G",
    time: "15:45",
    amount: 135,
    direction: "in",
    balanceAfter: 50879,
  },
  {
    id: "CM-C6WC2G-2",
    type: "Commission",
    method: "digital",
    icon: ShoppingBag,
    name: "Tunde Mokola",
    driverTo: "Dugbe",
    reference: "CM-C6WC2G",
    time: "15:45",
    amount: 135,
    direction: "in",
    balanceAfter: 50879,
  },
  {
    id: "PO-A1B2C3",
    type: "Payout",
    method: null,
    icon: MoneyIcon,
    name: "Tunde Adeyemi",
    reference: "PO-A1B2C3",
    time: "9:00 AM",
    amount: 11592,
    direction: "out",
    balanceAfter: 50879,
  },
];

const withdrawData = {
  walletBalance: 100000,
  owedToDrivers: 34789,
  get availableToWithdraw() {
    return this.walletBalance - this.owedToDrivers;
  },
};

const destinations = [
  {
    id: "business",
    label: "Business account",
    subtitle: "GTBank ****6789",
  },
  {
    id: "different",
    label: "A different account",
    subtitle: "One-time transfer destination",
    disabled: true,
  },
];

const confirmPayoutData = {
  driver: "Tunde Adeyemi",
  destination: "GTBank ****3210",
  amount: 15543,
  walletBalance: 34167,
};

export {
  earningsSummary,
  walletData,
  paymentWarning,
  recentDaysIncome,
  reconciliationData,
  driverBalances,
  walletLedger,
  walletStats,
  withdrawData,
  destinations,
  confirmPayoutData,
};
