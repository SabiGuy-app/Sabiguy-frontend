import "./App.css";
import "./index.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useServiceWorker } from "./hooks/useServiceWorker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import NotificationSoundService from "./services/notificationSoundService";
import { listenForMessages } from "./services/fcmService";
import { initAnalytics, trackPageView } from "./services/analytics";
import Loader from "./components/Loader";
import { Analytics } from '@vercel/analytics/react';
import AddDriverForm from "./business-transport/signup/ServiceProvider/BusinessSetup/AddDriverForm";
import AddVehicleForm from "./business-transport/signup/ServiceProvider/BusinessSetup/AddVehicleForm";
import BusinessInfo from "./business-transport/signup/ServiceProvider/BusinessSetup/BusinessInfo";
import IncomeSplitForm from "./business-transport/signup/ServiceProvider/BusinessSetup/IncomeSplitForm";
import BusinessForm from "./business-transport/signup/BusinessForm";

// Lazy-loaded components
const Welcome = lazy(() => import("./pages/signup/welcome"));
const Congrats = lazy(() => import("./pages/signup/ServiceProvider/congrats"));
const ForgotPassword = lazy(() => import("./pages/Forgot-Password/ForgotPassword"));
const OtpInput = lazy(() => import("./pages/Forgot-Password/OtpInput"));
const ResetPassword = lazy(() => import("./pages/Forgot-Password/ResetPassword"));
const Success = lazy(() => import("./pages/Forgot-Password/success"));
const SignupPage = lazy(() => import("./pages/signup/ServiceUser"));
const SignupForm = lazy(() => import("./pages/signup/ServiceProvider"));
const Login = lazy(() => import("./pages/login/Login"));
const DashboardHome = lazy(() => import("./pages/Dashboard/sections/Homepage"));
const Bookings = lazy(() => import("./pages/Dashboard/sections/Bookings/Bookings"));
const SavedProfile = lazy(() => import("./pages/Dashboard/sections/SavedProfile"));
const ChatPage = lazy(() => import("./pages/Dashboard/sections/Chat"));
const ActivityPage = lazy(() => import("./pages/Dashboard/sections/Activity"));
const ProfilePage = lazy(() => import("./pages/Dashboard/sections/Settings"));
const ContactPage = lazy(() => import("./pages/Dashboard/sections/Help"));
const Categories = lazy(() => import("./pages/Dashboard/sections/Categories"));
const DynamicServicePage = lazy(() => import("./pages/Dashboard/Services/pages/ServicePage"));
const AmbulanceServices = lazy(() => import("./pages/Dashboard/Services/pages/AmbulanceServices"));
const ProviderDetails = lazy(() => import("./pages/Dashboard/sections/ProviderDetails"));
const ProviderDashboard = lazy(() => import("./pages/ProviderDashboard/sections/Homepage"));
const HireAlerts = lazy(() => import("./pages/ProviderDashboard/sections/HireAlerts/HireAlerts"));
const StartNavigation = lazy(() => import("./pages/ProviderDashboard/sections/HireAlerts/StartNavigation"));
const TrackDelivery = lazy(() => import("./pages/ProviderDashboard/sections/HireAlerts/TrackDelivery"));
const ProviderProfilePage = lazy(() => import("./pages/ProviderDashboard/sections/Settings"));
const Notifications = lazy(() => import("./pages/ProviderDashboard/sections/Notification"));
const SearchingLoader = lazy(() => import("./components/dashboard/Searching"));
const AvailableProviders = lazy(() => import("./pages/Dashboard/sections/Bookings/AvailableProviders"));
const BookingSummary = lazy(() => import("./pages/Dashboard/sections/Bookings/BookingSummary"));
const PickupLocation = lazy(() => import("./pages/Dashboard/sections/Bookings/PickupLocation"));
const ProviderHelp = lazy(() => import("./pages/ProviderDashboard/sections/ProviderHelp"));
const ProviderActivity = lazy(() => import("./pages/ProviderDashboard/sections/ProviderActivity"));
const ProviderChat = lazy(() => import("./pages/ProviderDashboard/sections/ProviderChat"));
const WalletCallback = lazy(() => import("./pages/WalletCallback"));
const VehicleType = lazy(() => import("./pages/Dashboard/sections/Bookings/VehicleType"));
const AvailableRiders = lazy(() => import("./pages/Dashboard/sections/Bookings/AvailableRiders"));
const BookingSummary2 = lazy(() => import("./pages/Dashboard/sections/Bookings/BookingSummary2"));
const TrackRider = lazy(() => import("./pages/Dashboard/sections/Bookings/TrackRider"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const PolicyPage = lazy(() => import("./pages/Policies/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("./pages/Policies/TermsOfUse"));
const PaymentPolicy = lazy(() => import("./pages/Policies/Payment&Refunds"));
const SafetyPolicy = lazy(() => import("./pages/Policies/Safety&Trust"));
const RideServicesPolicy = lazy(() => import("./pages/Policies/RideServices"));
const DispatchPolicy = lazy(() => import("./pages/Policies/Dispatch&Delivery"));
const WebsiteDisclaimer = lazy(() => import("./pages/Policies/WebsiteDisclaimer"));
const CookiePolicy = lazy(() => import("./pages/Policies/Cookie"));
const CommunityGuidelines = lazy(() => import("./pages/Policies/CommunityGuidelines"));
const ProtectedRoute = lazy(() => import("./components/routes/ProtectedRoute"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const NotVerified = lazy(() => import("./pages/signup/ServiceProvider/kyc-not-verified"));
const NotificationTest = lazy(() => import("./services/testNotify"));
const BuyerNinUpload = lazy(() => import("./pages/kyc/BuyerNinUpload"));
const BuyerKycPending = lazy(() => import("./pages/kyc/BuyerKycPending"));
const FleetOverview = lazy(() => import("./business-transport/dashboard/pages/FleetOverview"));
const FleetComingSoon = lazy(() => import("./business-transport/dashboard/pages/ComingSoonPage"));


// Fixes double-slash URLs like //wallet/funding/callback from Paystack redirects
function URLNormalizer() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.includes("//")) {
      const normalized = location.pathname.replace(/\/+/g, "/");
      navigate(normalized + location.search, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  return null;
}

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  return null;
}

function ScrollToTopOnRouteChange() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash and an element exists, let the existing handlers handle it.
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        // scroll to the element smoothly
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    // Otherwise, scroll to top immediately on route change
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname, hash]);

  return null;
}

function App() {
  useServiceWorker();

  // Setup persistent notification listener with beautiful toast
  useEffect(() => {
    console.log("🔔 Setting up persistent message listener in App...");

    listenForMessages((payload) => {
      // Display beautiful bold notification toast
      const title = payload?.notification?.title || "New Notification";
      const body = payload?.notification?.body || "";

      toast.info(
        <div className="font-bold text-base">
          <div className="font-extrabold text-lg mb-2">{title}</div>
          <div className="font-semibold text-sm text-gray-700">{body}</div>
        </div>,
        {
          position: "top-right",
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "notification-toast-custom",
          bodyClassName: "notification-toast-body",
        },
      );

      console.log("✅ Toast notification displayed:", title);
    });
  }, []);

  useEffect(() => {
    let soundInitialized = false;

    const initSound = async (event) => {
      if (soundInitialized) return;

      console.log(
        `👆 User interaction detected (${event.type}), initializing sound...`,
      );

      try {
        await NotificationSoundService.init();

        soundInitialized = true;
        console.log("✅ Sound service ready");

        // Remove all listeners after successful init
        removeAllListeners();
      } catch (error) {
        console.error("❌ Failed to initialize sound:", error);
      }
    };

    const removeAllListeners = () => {
      document.removeEventListener("click", initSound);
      document.removeEventListener("touchstart", initSound);
      document.removeEventListener("touchend", initSound);
      document.removeEventListener("keydown", initSound);
      document.removeEventListener("scroll", initSound);
      window.removeEventListener("focus", initSound);
    };

    // Listen for MULTIPLE types of user interactions (critical for mobile)
    document.addEventListener("click", initSound);
    document.addEventListener("touchstart", initSound);
    document.addEventListener("touchend", initSound);
    document.addEventListener("keydown", initSound);
    document.addEventListener("scroll", initSound, { once: true });
    window.addEventListener("focus", initSound, { once: true });

    return removeAllListeners;
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={6000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{
          zIndex: 99999,
        }}
        toastClassName={() =>
          "relative flex p-4 min-h-20 rounded-lg justify-between overflow-hidden cursor-pointer shadow-lg bg-white border-l-4 border-blue-500"
        }
        bodyClassName={() =>
          "text-gray-800 font-semibold flex-1 flex items-center"
        }
        progressClassName="toastProgress"
      />

      <Router>
        <ScrollToTopOnRouteChange />
        <URLNormalizer />
        <AnalyticsTracker />
        <div>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="/policies" element={<PolicyPage />} />
              <Route path="/policies/privacy" element={<PolicyPage />} />
              <Route path="/policies/terms" element={<TermsOfUse />} />
              <Route path="/policies/payment" element={<PaymentPolicy />} />
              <Route path="/policies/safety" element={<SafetyPolicy />} />
              <Route path="/policies/ride-services" element={<RideServicesPolicy />} />
              <Route path="/policies/dispatch-delivery" element={<DispatchPolicy />} />
              <Route path="/policies/website" element={<WebsiteDisclaimer />} />
              <Route path="/policies/cookies" element={<CookiePolicy />} />
              <Route path="/policies/community" element={<CommunityGuidelines />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/service-provider/signup" element={<SignupForm />} />
              <Route path="/congrats" element={<Congrats />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/otp-input" element={<OtpInput />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/success" element={<Success />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/kyc-not-verified" element={<NotVerified />} />

              <Route path="/business-provider/signup" element={<BusinessForm />} />

              {/* Payment callbacks — outside ProtectedRoute so they work after Paystack redirect */}
              <Route
                path="/wallet/funding/callback"
                element={<WalletCallback />}
              />
              <Route path="/payment/callback" element={<WalletCallback />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/kyc/nin" element={<BuyerNinUpload />} />
                <Route path="/kyc/pending" element={<BuyerKycPending />} />
                <Route path="/dashboard" element={<DashboardHome />} />
                <Route
                  path="/dashboard/provider"
                  element={<ProviderDashboard />}
                />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/dashboard/saved" element={<SavedProfile />} />
                <Route path="/dashboard/chat" element={<ChatPage />} />
                <Route
                  path="/dashboard/provider/chat"
                  element={<ProviderChat />}
                />
                <Route path="/dashboard/activity" element={<ActivityPage />} />
                <Route path="/dashboard/test" element={<NotificationTest />} />

                <Route
                  path="/dashboard/provider/activity"
                  element={<ProviderActivity />}
                />
                <Route
                  path="/dashboard/provider/hire-alert"
                  element={<HireAlerts />}
                />
                <Route
                  path="/dashboard/provider/start-navigation"
                  element={<StartNavigation />}
                />
                <Route
                  path="/dashboard/provider/track-delivery"
                  element={<TrackDelivery />}
                />
                <Route path="/dashboard/settings" element={<ProfilePage />} />
                {/* Wallet/payment callbacks moved outside ProtectedRoute above */}
                <Route path="/dashboard/help" element={<ContactPage />} />
                <Route
                  path="/dashboard/provider/help"
                  element={<ProviderHelp />}
                />
                <Route path="/dashboard/categories" element={<Categories />} />
                <Route
                  path="/dashboard/categories/:serviceSlug"
                  element={<DynamicServicePage />}
                />
                <Route
                  path="/dashboard/categories/emergency"
                  element={<AmbulanceServices />}
                />
                <Route
                  path="/dashboard/provider/:providerId"
                  element={<ProviderDetails />}
                />
                <Route
                  path="/dashboard/provider/track"
                  element={<PickupLocation />}
                />
                <Route
                  path="/dashboard/provider/settings"
                  element={<ProviderProfilePage />}
                />
                <Route
                  path="/dashboard/provider/notification"
                  element={<Notifications />}
                />
                <Route
                  path="/dashboard/provider/searching"
                  element={<SearchingLoader />}
                />
                <Route
                  path="/dashboard/provider/ava"
                  element={<AvailableProviders />}
                />
                <Route
                  path="/dashboard/provider/summary"
                  element={<BookingSummary />}
                />
                <Route path="/bookings/vehicletype" element={<VehicleType />} />
                <Route
                  path="/bookings/availableriders"
                  element={<AvailableRiders />}
                />
                <Route path="/bookings/summary" element={<BookingSummary2 />} />
                <Route path="/bookings/trackrider" element={<TrackRider />} />
                <Route path="/kyc-not-verified" element={<NotVerified />} />

                {/* Business / fleet-operator dashboard */}
                <Route
                  path="/business-provider/dashboard"
                  element={<FleetOverview />}
                />
                <Route
                  path="/business-provider/dashboard/live-map"
                  element={<FleetComingSoon title="Live Map" />}
                />
                <Route
                  path="/business-provider/dashboard/drivers"
                  element={<FleetComingSoon title="Drivers" />}
                />
                <Route
                  path="/business-provider/dashboard/vehicles"
                  element={<FleetComingSoon title="Vehicles" />}
                />
                <Route
                  path="/business-provider/dashboard/trips"
                  element={<FleetComingSoon title="Trips" />}
                />
                <Route
                  path="/business-provider/dashboard/groups"
                  element={<FleetComingSoon title="Groups" />}
                />
                <Route
                  path="/business-provider/dashboard/policies"
                  element={<FleetComingSoon title="Policies" />}
                />
                <Route
                  path="/business-provider/dashboard/earnings"
                  element={<FleetComingSoon title="Earnings & Payouts" />}
                />
                <Route
                  path="/business-provider/dashboard/performance"
                  element={<FleetComingSoon title="Performance & Ratings" />}
                />
                <Route
                  path="/business-provider/dashboard/documents"
                  element={<FleetComingSoon title="Documents" />}
                />
                <Route
                  path="/business-provider/dashboard/settings"
                  element={<FleetComingSoon title="Settings" />}
                />
              </Route>
            </Routes>
          </Suspense>
        </div>
      </Router>
      <Analytics />
    </>
  );
}

export default App;
