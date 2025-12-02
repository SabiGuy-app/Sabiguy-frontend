
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
import Bookings from './pages/Dashboard/sections/Bookings';
import SavedProfile from './pages/Dashboard/sections/SavedProfile';
import ChatPage from './pages/Dashboard/sections/Chat';
import ActivityPage from './pages/Dashboard/sections/Activity';
import ProfilePage from './pages/Dashboard/sections/Settings';
import ContactPage from './pages/Dashboard/sections/Help';
import Categories from './pages/Dashboard/sections/Categories';
// import Pages from './pages/Dashboard/Services/pages';
import DynamicServicePage from './pages/Dashboard/Services/pages/ServicePage';
import AmbulanceServices from './pages/Dashboard/Services/pages/AmbulanceServices'
import ProviderDetails from './pages/Dashboard/sections/ProviderDetails';
function App() {

  return (
    <Router>
      <div>
        <Routes>
              <Route path="/" element={<Welcome/>} />
              <Route path="/signup" element={<SignupPage/>} />
              <Route path="/service-provider/signup" element={<SignupForm/>} />
              <Route path="/congrats" element={<Congrats/>} />
              <Route path="/forgot-password" element={<ForgotPassword/>} />
              <Route path="/otp-input" element={<OtpInput/>} />
              <Route path="/reset-password" element={<ResetPassword/>} />
              <Route path="/success" element={<Success/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/dashboard" element={<DashboardHome/>} />
              <Route path="/bookings" element={<Bookings/>} />
              <Route path="/dashboard/saved" element={<SavedProfile/>} />
              <Route path="/dashboard/chat" element={<ChatPage/>} />
              <Route path="/dashboard/activity" element={<ActivityPage/>} />
              <Route path="/dashboard/settings" element={<ProfilePage/>} />
              <Route path="/dashboard/help" element={<ContactPage/>} />
              <Route path="/dashboard/categories" element={<Categories/>} />
             <Route path="/dashboard/categories/:serviceSlug" element={<DynamicServicePage />} />

              <Route path="/dashboard/categories/emergency" element={<AmbulanceServices/>} />
              <Route path="/dashboard/provider/:providerId" element={<ProviderDetails />} />



        </Routes>
        </div>
    </Router>
  )
}

export default App
