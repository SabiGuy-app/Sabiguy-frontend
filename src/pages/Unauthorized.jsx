import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";

export default function Unauthorized() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md w-full text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Unauthorized
        </h1>
        <p className="text-gray-600 mb-6">
          You need to be logged in to view this page. Redirecting to the
          homepage...
        </p>
        <Button type="button" onClick={() => navigate("/")}>
          Go to Homepage
        </Button>
      </div>
    </div>
  );
}
