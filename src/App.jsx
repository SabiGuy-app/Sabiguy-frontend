
import './App.css'
import './index.css'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Welcome from './pages/signup/welcome';
import Congrats from './pages/signup/ServiceProvider/congrats';
import ForgotPassword from './pages/Forgot-Password/ForgotPassword';
import OtpInput from './pages/Forgot-Password/OtpInput';
import ResetPassword from './pages/Forgot-Password/ResetPassword';
import Success from './pages/Forgot-Password/success';
import SignupPage from './pages/signup/ServiceUser';
import SignupForm from './pages/signup/ServiceProvider';
import Login from './pages/login/Login';
import DashboardHome from './pages/Dashboard/sections/Homepage';
import Bookings from './pages/Dashboard/sections/Bookings/Bookings';
import SavedProfile from './pages/Dashboard/sections/SavedProfile';
import ChatPage from './pages/Dashboard/sections/Chat';
import ActivityPage from './pages/Dashboard/sections/Activity';
import ProfilePage from './pages/Dashboard/sections/Settings';
import ContactPage from './pages/Dashboard/sections/Help';
import Categories from './pages/Dashboard/sections/Categories';
import DynamicServicePage from './pages/Dashboard/Services/pages/ServicePage';
import AmbulanceServices from './pages/Dashboard/Services/pages/AmbulanceServices'
import ProviderDetails from './pages/Dashboard/sections/ProviderDetails';
import ProviderDashboard from './pages/ProviderDashboard/sections/Homepage';
import HireAlerts from './pages/ProviderDashboard/sections/HireAlerts/HireAlerts';
import LiveTrackingPage from './pages/ProviderDashboard/sections/HireAlerts/TrackProvider';
import ProviderProfilePage from './pages/ProviderDashboard/sections/Settings';
import Notifications from './pages/ProviderDashboard/sections/Notification';
import ReviewModalsExample from './pages/Dashboard/Examples';
import SearchingLoader from './components/dashboard/Searching';
import AvailableProviders from './pages/Dashboard/sections/Bookings/AvailableProviders';
import BookingSummary from './pages/Dashboard/sections/Bookings/BookingSummary';
import PickupLocation from './pages/Dashboard/sections/Bookings/PickupLocation';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {


  return (
    <>
          <ToastContainer position="top-right" autoClose={5000} />

    <Router>
      <div>
        <Routes>
              <Route path="/" element={<Welcome/>} />
                   <Route path="/eng" element={<ReviewModalsExample/>} />
              <Route path="/signup" element={<SignupPage/>} />
              <Route path="/service-provider/signup" element={<SignupForm/>} />
              <Route path="/congrats" element={<Congrats/>} />
              <Route path="/forgot-password" element={<ForgotPassword/>} />
              <Route path="/otp-input" element={<OtpInput/>} />
              <Route path="/reset-password" element={<ResetPassword/>} />
              <Route path="/success" element={<Success/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/dashboard" element={<DashboardHome/>} />
               <Route path="/dashboard/provider/hire-alert" element={<HireAlerts/>} />                
               <Route path="/dashboard/provider" element={<ProviderDashboard/>} />
              <Route path="/bookings" element={<Bookings/>} />
              <Route path="/dashboard/saved" element={<SavedProfile/>} />
              <Route path="/dashboard/chat" element={<ChatPage/>} />
              <Route path="/dashboard/provider/chat" element={<ChatPage/>} />
              <Route path="/dashboard/activity" element={<ActivityPage/>} />
               <Route path="/dashboard/provider/activity" element={<ActivityPage/>} />
              <Route path="/dashboard/settings" element={<ProfilePage/>} />
              <Route path="/dashboard/help" element={<ContactPage/>} />
              <Route path="/dashboard/provider/help" element={<ContactPage/>} />
              <Route path="/dashboard/categories" element={<Categories/>} />
             <Route path="/dashboard/categories/:serviceSlug" element={<DynamicServicePage />} />
              <Route path="/dashboard/categories/emergency" element={<AmbulanceServices/>} />
              <Route path="/dashboard/provider/:providerId" element={<ProviderDetails />} />
              <Route path="/dashboard/provider/track" element={<PickupLocation />} />
              <Route path="/dashboard/provider/settings" element={<ProviderProfilePage/>} />
              <Route path="/dashboard/provider/notification" element={<Notifications/>} />
              <Route path="/dashboard/provider/searching" element={<SearchingLoader/>} />
              <Route path="/dashboard/provider/ava" element={<AvailableProviders/>} />
              <Route path="/dashboard/provider/summary" element={<BookingSummary/>} />

        </Routes>
        </div>
    </Router>
    </>
  )
}

export default App
