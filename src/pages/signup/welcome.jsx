import AuthLayout from "../../components/layouts/layout";
import SignupNavbar from "../../components/layouts/navbar";
import { FaArrowRight, FaSearch, FaWrench } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Welcome() {
  return (
    <div className="h-screen">
      <SignupNavbar />
      <AuthLayout
        title="Get Help. Get It Done."
        description="Reliable professionals at your fingertips — anytime, anywhere."
      >
        <motion.div
          key="step-one"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl mt-4 font-semibold text-center mb-1">
            Join SabiGuy Now
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Choose how you want to get started.
          </p>

          <div className="p-6 flex flex-col items-center justify-center space-y-6">
            {/* Card 1 */}
            <Link to="/signup" className="block w-full max-w-md">
              <div className="bg-white border-2 border-gray-400 rounded-xl shadow-lg p-6 transition hover:shadow-xl hover:border-green-600 cursor-pointer text-center">
                {/* Icon Circle */}
                <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <FaSearch className="text-green-700" size={28} />
                </div>

                {/* Text */}
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  Book a Service Now
                </h2>
                <p className="text-gray-600">
                  Stop waiting. Find trusted drivers and logistics professionals ready to move you  — right now.
                </p>
                {/* <p className="text-gray-600 text-sm">
                  Connect with plumbers, electricians, tutors, tech experts and
                  more.
                </p> */}
              </div>
            </Link>

            {/* Card 2 */}
            <Link
              to="/service-provider/signup"
              className="block w-full max-w-md"
            >
              <div className="bg-white border-2 border-gray-400 rounded-xl shadow-lg p-6 transition hover:shadow-xl hover:border-[#FF791A] cursor-pointer text-center">
                {/* Icon Circle */}
                <div className="w-16 h-16 mx-auto rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <FaWrench className="text-[#FF791A]" size={28} />
                </div>

                {/* Text */}
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  Start Earning Today
                </h2>
                <p className="text-gray-600">
                  Turn your skills into income. Get Hired for jobs in your area  — your next client is waiting.
                </p>
                {/* <p className="text-gray-600 text-sm">
                  Showcase your skills and get hired for jobs in your area.
                </p> */}
              </div>
            </Link>
          </div>

          <div className="text-center text-sm mt-4 mb-5">
            Already have an account?
            <div className="group inline-flex">
              {/* Arrow icon that appears on hover */}

              <Link to="/login">
                <button className="text-lg px-4 py-2 font-medium text-[#005823] hover:text-black transition-all duration-200 flex items-center">
                  <span>Login</span>

                  <FaArrowRight
                    size={20}
                    className="ml-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-black"
                  />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </AuthLayout>
    </div>
  );
}
