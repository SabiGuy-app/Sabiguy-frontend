import Button from "../../../components/button";
import { useNavigate } from "react-router-dom";

export default function StepThree() {
    const navigate = useNavigate();

    const handleBackToLogin = () => {
        navigate("/login");
    };

    return (
        <div className="flex flex-col min-h-screen justify-center items-center px-6 text-center">
            <h2 className="font-semibold text-3xl mb-6">KYC Submitted</h2>
            <img src="/Group.svg" alt="KYC submitted" className="w-full max-w-md" />
            <p className="text-gray-500 mb-5 max-w-xl leading-relaxed">
                Your KYC verification has been submitted successfully. Our
                support/KYC team is currently reviewing your details. You will be
                notified once your KYC is approved.
            </p>
            <div className="flex gap-10 mt-6">
                <Button size="md" onClick={handleBackToLogin}>
                    Back to Login
                </Button>
            </div>
            <p className="text-gray-500 text-sm font-extralight italic mt-8">
                Tip: Keep an eye on your email for KYC approval updates.
            </p>
        </div>
    );
}
