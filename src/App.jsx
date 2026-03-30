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
import LiveTrackingPage from "./pages/ProviderDashboard/sections/HireAlerts/TrackProvider";
import StartNavigation from "./pages/ProviderDashboard/sections/HireAlerts/StartNavigation";
import TrackDelivery from "./pages/ProviderDashboard/sections/HireAlerts/TrackDelivery";
import ProviderProfilePage from "./pages/ProviderDashboard/sections/Settings";
import Notifications from "./pages/ProviderDashboard/sections/Notification";
import SearchingLoader from "./components/dashboard/Searching";
import AvailableProviders from "./pages/Dashboard/sections/Bookings/AvailableProviders";
import BookingSummary from "./pages/Dashboard/sections/Bookings/BookingSummary";
import PickupLocation from "./pages/Dashboard/sections/Bookings/PickupLocation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProviderHelp from "./pages/ProviderDashboard/sections/ProviderHelp";
import ProviderActivity from "./pages/ProviderDashboard/sections/ProviderActivity";
import ProviderChat from "./pages/ProviderDashboard/sections/ProviderChat";
import WalletCallback from "./pages/WalletCallback";
import VehicleType from "./pages/Dashboard/sections/Bookings/VehicleType";
import AvailableRiders from "./pages/Dashboard/sections/Bookings/AvailableRiders";
import BookingSummary2 from "./pages/Dashboard/sections/Bookings/BookingSummary2";
import TrackRider from "./pages/Dashboard/sections/Bookings/TrackRider";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
// Fixes double-slash URLs like //wallet/funding/callback from Paystack redirects
function URLNormalizer() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.includes('//')) {
      const normalized = location.pathname.replace(/\/+/g, '/');
      navigate(normalized + location.search, { replace: true });
    }
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />

      <Router>
        <URLNormalizer />
        <div>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/service-provider/signup" element={<SignupForm />} />
            <Route path="/congrats" element={<Congrats />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/otp-input" element={<OtpInput />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/success" element={<Success />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Payment callbacks — outside ProtectedRoute so they work after Paystack redirect */}
            <Route path="/wallet/funding/callback" element={<WalletCallback />} />
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
            </Route>
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
