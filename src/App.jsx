
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
















        </Routes>

        </div>
    </Router>
  )
}

export default App
