import { useNavigate } from "react-router-dom";
import notfound from "../../../public/not-found.png";

export default function DashboardNotFound({ dashboardPath }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-7xl flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
        <div className="w-full lg:w-[45%] text-center lg:text-left">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
            We could not find this page
          </h1>

          <ul className="list-disc pl-5 space-y-3 text-gray-600 text-base leading-7 text-left">
            <li>Try to refresh the page.</li>
            <li>
              Go back to where you were and try again to access this page.
            </li>
            <li>
              If you have entered the page URL manually, check it's the right
              URL.
            </li>
          </ul>

          <button
            onClick={() => navigate(dashboardPath)}
            className="mt-8 bg-[#207A51] hover:bg-[#1a6444] text-white font-semibold px-6 py-3 rounded-md transition-colors"
          >
            Go to Home
          </button>
        </div>

        <div className="w-full lg:w-[48%] flex justify-center">
          <img
            src={notfound}
            alt="404 illustration"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}