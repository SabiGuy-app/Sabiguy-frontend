import { useState, useEffect } from "react";
import ProviderDashboardLayout from "../../../components/layouts/ProviderDashboardLayout";
import DashboardCard from "../../../components/dashboard/DashboardCard";
import { Wallet, Bookmark, CheckCircle, MapPin, Building2, X, ArrowRight, Check } from "lucide-react";
import RevenueOverview from "../../../components/provider-dashboard/RevenueOverview";
import AverageResponseTime from "../../../components/provider-dashboard/AverageResponseTime";
import PeakHourAnalysis from "../../../components/provider-dashboard/Analysis";
import BookingsByDayOfWeek from "../../../components/provider-dashboard/Bookings";
import WalletCard from "../../../components/provider-dashboard/WalletCard";
import RevenueByServiceType from "../../../components/provider-dashboard/RevenueByService";
import RecentTransactions from "../../../components/provider-dashboard/RecentTransactions";
import {
  getDashboardStats,
  formatCurrency,
  updateProviderLocation,
} from "../../../api/provider";
import { useAuthStore } from "../../../stores/auth.store";
import { getUserById } from "../../../api/user";
import api from "../../../api/axios";

export default function ProviderDashboard() {
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [inviteBusiness, setInviteBusiness] = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteAction, setInviteAction] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [inviteNotice, setInviteNotice] = useState("");
  const invitedBy = user?.data?.invitedBy ?? user?.invitedBy;
  const staffId = user?.data?.staffId ?? user?.staffId;
  const hasBusinessInvite = Boolean(
    invitedBy && invitedBy !== "null" && (staffId == null || staffId === "null"),
  );

  useEffect(() => {
    if (!hasBusinessInvite) return;
    let cancelled = false;
    getUserById(invitedBy)
      .then((response) => {
        if (!cancelled) setInviteBusiness(response?.data || response);
      })
      .catch((error) => {
        if (!cancelled) setInviteError(error?.response?.data?.message || "Could not load business details.");
      });
    return () => { cancelled = true; };
  }, [hasBusinessInvite, invitedBy]);

  const openInvite = async () => {
    setInviteOpen(true);
    setInviteError("");
    if (inviteBusiness?._id === invitedBy) return;
    try {
      setInviteLoading(true);
      const response = await getUserById(invitedBy);
      setInviteBusiness(response?.data || response);
    } catch (error) {
      setInviteError(error?.response?.data?.message || "Could not load business details.");
    } finally {
      setInviteLoading(false);
    }
  };

  const respondToInvite = async (status) => {
    const staffEmail = user?.data?.email || user?.email;
    const businessEmail = inviteBusiness?.email || inviteBusiness?.Email || inviteBusiness?.businessEmail;
    if (!staffEmail || !businessEmail) {
      setInviteError("We could not find the email details needed to respond to this invite.");
      return;
    }
    try {
      setInviteAction(status);
      setInviteError("");
      await api.post("/business/staff/invites/respond", { staffEmail, businessEmail, status });
      useAuthStore.getState().updateUser((current) => {
        if (current?.data) return { ...current, data: { ...current.data, invitedBy: null } };
        return { ...current, invitedBy: null };
      });
      setInviteNotice(status === "accept"
        ? "Invitation accepted. You’ve joined the business team."
        : "Invitation declined.");
      setInviteOpen(false);
    } catch (error) {
      setInviteError(error?.response?.data?.message || "Could not update the invitation. Please try again.");
    } finally {
      setInviteAction("");
    }
  };

  // ── Fetch dashboard stats ──────────────────────────────────────────────
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getDashboardStats();

        // Confirmed API shape (flat object inside data):
        // {
        //   totalEarnings, activeBookings, completedBookings,
        //   revenueOverview: { total, last7Days, last30Days },
        //   averageResponseTimeMinutes: <number>,
        //   bookingsByDayOfWeek: [{ day, dayIndex, count }],
        //   peakHourAnalysis: { peakHour, peakHourCount, buckets: [{ hour, count }] }
        // }
        const raw = response?.data || response;

        setDashboardData({
          // Stat cards
          totalEarnings: raw?.totalEarnings ?? 0,
          activeBookings: raw?.activeBookings ?? 0,
          completedBookings: raw?.completedBookings ?? 0,

          // Revenue Overview — pass object { last7Days, last30Days, total }
          revenueData: raw?.revenueOverview
            ? {
                last7Days: raw.revenueOverview.last7Days || 0,
                last30Days: raw.revenueOverview.last30Days || 0,
                total: raw.revenueOverview.total || 0,
              }
            : null,

          // Average Response Time — raw number in minutes
          responseTimeData: raw?.averageResponseTimeMinutes ?? null,

          // Bookings by Day — normalise to { day, bookings }
          bookingsByDay: (raw?.bookingsByDayOfWeek || []).map((d) => ({
            day: (d.day || "").slice(0, 3),
            bookings: d.count ?? d.bookings ?? 0,
          })),

          // Peak Hour Analysis — pass buckets [{ hour, count }]
          peakHoursData: (raw?.peakHourAnalysis?.buckets || []).map((b) => ({
            hour: b.hour,
            bookings: b.count ?? b.bookings ?? 0,
          })),

          // Revenue by Service — not in API yet, shows empty state
          revenueByService: raw?.revenueByService || [],
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError(
          err.response?.data?.message || "Failed to load dashboard data",
        );
        setDashboardData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  useEffect(() => {
    const displayLocation = async () => {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const data = await updateProviderLocation({ latitude, longitude });
          const address = data?.data?.currentLocation?.address;
          if (address) {
            setLocation(address);
          }
        } catch (error) {
          console.error("Error updating location:", error);
        }
      });
    };
    displayLocation();
  }, []);

  // ── Guard: wait for zustand hydration ─────────────────────────────────
  // NOTE: this must come AFTER all hooks (useEffect above)
  if (!hydrated) {
    return (
      <ProviderDashboardLayout>
        <main className="flex-1 min-h-screen p-3 sm:p-6 pt-4 sm:pt-20 w-full">
          <div className="text-center">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
        </main>
      </ProviderDashboardLayout>
    );
  }

  const Job = user?.data?.job;
  const totalRevenue = dashboardData?.totalEarnings || 0;
  const activeJobs = dashboardData?.activeBookings || 0;
  const completedJobs = dashboardData?.completedBookings || 0;

  return (
    <ProviderDashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold mb-1">
            Welcome Back, {user?.data?.fullName?.split(" ")[0]} 👋
          </h2>
          <p className="text-sm text-[#005823] mb-1 flex items-center gap-1">
            <MapPin size={16} />
            {isLoading
              ? "Location loading..."
              : location || "Updating your location..."}
          </p>
          <p className="mb-2 text-sm">
            Here's a quick look at your business performance today.
          </p>
        </div>
      </div>
      {hasBusinessInvite && (
        <section className="mb-5 flex items-center justify-between gap-4 rounded-xl bg-[#20232b] p-5 text-white shadow-sm">
          <div className="flex min-w-0 items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-white text-[#327c53]"><Building2 size={32} /></span>
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-wide">Invitation</p>
              <p className="truncate font-medium">{inviteBusiness?.BusinessName || inviteBusiness?.businessName || "A business"} wants you on their team</p>
              <p className="text-sm text-gray-300">You have been invited to join a business team.</p>
            </div>
          </div>
          <button onClick={openInvite} className="flex shrink-0 items-center gap-2 rounded-lg bg-[#327c53] px-5 py-3 font-medium hover:bg-[#286844]">View Details <ArrowRight size={18} /></button>
        </section>
      )}
      {inviteNotice && (
        <div role="status" className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <span>{inviteNotice}</span>
          <button type="button" onClick={() => setInviteNotice("")} aria-label="Dismiss message" className="rounded p-1 hover:bg-emerald-100"><X size={18} /></button>
        </div>
      )}
      {inviteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setInviteOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="invite-title" className="max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b px-6 py-5"><h2 id="invite-title" className="text-xl font-semibold">Invitation to join a business</h2><button aria-label="Close" onClick={() => setInviteOpen(false)} className="rounded p-1 hover:bg-gray-100"><X /></button></header>
            <div className="space-y-4 p-6">
              {inviteLoading ? <p className="py-10 text-center text-gray-500">Loading business details…</p> : inviteError && !inviteBusiness ? <p className="text-sm text-red-600">{inviteError}</p> : <>
                <div className="flex items-center gap-4"><span className="grid h-[72px] w-[72px] place-items-center rounded-full border border-[#327c53] text-[#327c53]"><Building2 size={36} /></span><div><h3 className="font-semibold">{inviteBusiness?.BusinessName || inviteBusiness?.businessName || inviteBusiness?.name || "Business"}</h3><p className="text-sm text-gray-600">{inviteBusiness?.businessCategory || inviteBusiness?.businessType || inviteBusiness?.category || "Business"}{(inviteBusiness?.BusinessAddress || inviteBusiness?.address) ? ` · ${inviteBusiness.currentLocation?.address || inviteBusiness.businessAddress || inviteBusiness.address}` : ""}</p></div></div>
                <div className="flex flex-wrap gap-2 text-sm"><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-800">✓ Verified business</span>{(inviteBusiness?.rating || inviteBusiness?.averageRating) && <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-800">{typeof inviteBusiness.rating === "object" ? inviteBusiness.rating.average : inviteBusiness.rating || inviteBusiness.averageRating}★ · {(typeof inviteBusiness.rating === "object" ? inviteBusiness.rating.count : inviteBusiness.reviewCount || inviteBusiness.totalReviews) || 0} reviews</span>}{inviteBusiness?.createdAt && <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-800">On the app since {new Date(inviteBusiness.createdAt).toLocaleDateString("en", { month: "short", year: "numeric" })}</span>}</div>
                <div><h3 className="mb-3 text-lg font-semibold">Services you can be assigned</h3><div className="flex flex-wrap gap-2">{(inviteBusiness?.service || inviteBusiness?.services || inviteBusiness?.serviceDetails || []).map((item, index) => { const name = typeof item === "string" ? item : item?.serviceName || item?.name || item?.title; return name ? <span key={`${name}-${index}`} className="inline-flex items-center gap-1.5 rounded-full bg-[#327c53] px-4 py-2 text-sm text-white"><Check size={15} />{name}</span> : null; })}{(!(inviteBusiness?.service || inviteBusiness?.services || inviteBusiness?.serviceDetails)?.length) && <span className="text-sm text-gray-500">Business service details unavailable.</span>}</div></div>
                <p className="text-sm italic text-amber-800">{inviteBusiness?.BusinessName || inviteBusiness?.businessName || "This business"} sets its own prices for its jobs.</p>
                <div className="rounded-lg bg-[#f0eafa] p-4 text-sm leading-6 text-gray-600"><strong className="font-medium text-gray-700">Your own bookings stay yours.</strong><br />Allowed outside your shifts. Your personal profile, prices, wallet and reviews don’t change.<br />You can’t take personal bookings from customers you served for this business in the last 90 days.</div>
                {inviteError && <p role="alert" className="text-sm text-red-600">{inviteError}</p>}
                <div className="grid grid-cols-2 gap-4 pt-1"><button disabled={Boolean(inviteAction)} onClick={() => respondToInvite("decline")} className="rounded-lg border px-4 py-3 font-medium disabled:opacity-60">{inviteAction === "decline" ? "Declining…" : "Decline"}</button><button disabled={Boolean(inviteAction)} onClick={() => respondToInvite("accept")} className="rounded-lg bg-[#327c53] px-4 py-3 font-medium text-white disabled:opacity-60">{inviteAction === "accept" ? "Accepting…" : "Accept & Join"}</button></div>
              </>}
            </div>
          </section>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Revenue"
          amount={isLoading ? "Loading..." : formatCurrency(totalRevenue)}
          icon={<Wallet size={20} />}
        />

        <DashboardCard
          title="Active Jobs"
          amount={isLoading ? "Loading..." : activeJobs.toString()}
          icon={<Bookmark size={20} />}
        />

        <DashboardCard
          title="Completed Jobs"
          amount={isLoading ? "Loading..." : completedJobs.toString()}
          icon={<CheckCircle size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 mt-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="md:col-span-1 lg:col-span-1 xl:col-span-2 space-y-6">
          <RevenueOverview data={dashboardData?.revenueData} />
          <AverageResponseTime data={dashboardData?.responseTimeData} />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <WalletCard data={dashboardData?.walletData} />
          </div>
          <div>
            {/* <RevenueByServiceType data={dashboardData?.revenueByService} amount={completedJobs.toString()} /> */}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-10">
        <div className="w-full lg:w-[30%] space-y-6">
          <PeakHourAnalysis data={dashboardData?.peakHoursData} />
          <BookingsByDayOfWeek data={dashboardData?.bookingsByDay} />
        </div>

        <div className="w-full lg:w-[70%] space-y-6">
          <RecentTransactions data={dashboardData?.transactions} />
        </div>
      </div>
    </ProviderDashboardLayout>
  );
}
