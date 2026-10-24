import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button";

export default function BusinessCongrats() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("business-onboarding-draft");
    localStorage.removeItem("business-service-details-draft");
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-6 text-3xl font-semibold">All Done!</h2>
      <img src="/Group.svg" alt="Group" className="w-full max-w-md" />
      <p className="mb-3 mt-5 max-w-2xl text-xl">
       Your business account is now ready! You can log in using the credentials you provided during registration to access your business dashboard.

We’ll notify you once the review of your submitted documents is complete. Thank you for choosing us!
      </p>
      <div className="mt-8">
        <Button size="md" onClick={() => navigate("/login")}>
          Log In
        </Button>
      </div>
    </div>
  );
}
