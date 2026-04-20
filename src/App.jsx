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
import { useEffect } from "react";
import { useServiceWorker } from "./hooks/useServiceWorker";
import Welcome from "./pages/signup/welcome";
import Congrats from "./pages/signup/ServiceProvider/congrats";
import ForgotPassword from "./pages/Forgot-Password/ForgotPassword";
import OtpInput from "./pages/Forgot-Password/OtpInput";
import ResetPassword from "./pages/Forgot-Password/ResetPassword";
import Success from "./pages/Forgot-Password/success";
import SignupPage from "./pages/signup/ServiceUser";
import SignupForm from "./pages/signup/ServiceProvider";
import Login from "./pages/login/Login";
import DashboardHome from "./pages/Dashboard/sections/Homepage";
import Bookings from "./pages/Dashboard/sections/Bookings/Bookings";
import SavedProfile from "./pages/Dashboard/sections/SavedProfile";
import ChatPage from "./pages/Dashboard/sections/Chat";
import ActivityPage from "./pages/Dashboard/sections/Activity";
import ProfilePage from "./pages/Dashboard/sections/Settings";
import ContactPage from "./pages/Dashboard/sections/Help";
import Categories from "./pages/Dashboard/sections/Categories";
import DynamicServicePage from "./pages/Dashboard/Services/pages/ServicePage";
import AmbulanceServices from "./pages/Dashboard/Services/pages/AmbulanceServices";
import ProviderDetails from "./pages/Dashboard/sections/ProviderDetails";
import ProviderDashboard from "./pages/ProviderDashboard/sections/Homepage";
import HireAlerts from "./pages/ProviderDashboard/sections/HireAlerts/HireAlerts";
import StartNavigation from "./pages/ProviderDashboard/sections/HireAlerts/StartNavigation";
import TrackDelivery from "./pages/ProviderDashboard/sections/HireAlerts/TrackDelivery";
import ProviderProfilePage from "./pages/ProviderDashboard/sections/Settings";
import Notifications from "./pages/ProviderDashboard/sections/Notification";
import SearchingLoader from "./components/dashboard/Searching";
import AvailableProviders from "./pages/Dashboard/sections/Bookings/AvailableProviders";
import BookingSummary from "./pages/Dashboard/sections/Bookings/BookingSummary";
import PickupLocation from "./pages/Dashboard/sections/Bookings/PickupLocation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProviderHelp from "./pages/ProviderDashboard/sections/ProviderHelp";
import ProviderActivity from "./pages/ProviderDashboard/sections/ProviderActivity";
import ProviderChat from "./pages/ProviderDashboard/sections/ProviderChat";
import WalletCallback from "./pages/WalletCallback";
import VehicleType from "./pages/Dashboard/sections/Bookings/VehicleType";
import AvailableRiders from "./pages/Dashboard/sections/Bookings/AvailableRiders";
import BookingSummary2 from "./pages/Dashboard/sections/Bookings/BookingSummary2";
import TrackRider from "./pages/Dashboard/sections/Bookings/TrackRider";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import NotVerified from "./pages/signup/ServiceProvider/kyc-not-verified";
import { isMobile } from "./utils/mobileDetection";
import NotificationSoundService from "./services/notificationSoundService";
import NotificationTest from "./services/testNotify";
import { listenForMessages } from "./services/fcmService";

// Fixes double-slash URLs like //wallet/funding/callback from Paystack redirects
function URLNormalizer() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.includes("//")) {
      const normalized = location.pathname.replace(/\/+/g, "/");
      navigate(normalized + location.search, { replace: true });
    }
  }, [location.pathname, navigate]);

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

        // On mobile, also play a silent sound to unlock audio
        if (isMobile()) {
          console.log("📱 Unlocking mobile audio with silent play...");
          const unlockAudio = new Audio("/notify.mp3");
          unlockAudio.volume = 0; // Silent
          try {
            await unlockAudio.play();
            unlockAudio.pause();
            unlockAudio.volume = 1.0;
            console.log("✅ Mobile audio unlocked");
          } catch (unlockError) {
            console.warn("⚠️ Failed to unlock audio:", unlockError);
          }
        }

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
        <URLNormalizer />
        <div>
          <Routes>
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/" element={<LandingPage />} />
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

            {/* Payment callbacks — outside ProtectedRoute so they work after Paystack redirect */}
            <Route
              path="/wallet/funding/callback"
              element={<WalletCallback />}
            />
            <Route path="/payment/callback" element={<WalletCallback />} />

            <Route element={<ProtectedRoute />}>
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
            </Route>
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
