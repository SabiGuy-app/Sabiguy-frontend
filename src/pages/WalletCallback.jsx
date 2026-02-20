import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaymentConfirmationModal from "../components/dashboard/PaymentConfirmationModal";
import { verifyPayment } from "../api/payment";
import { toast } from "react-hot-toast";

export default function WalletCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    // Safety check for nulls
    const reference = searchParams.get("reference") || "";
    const urlBookingId = searchParams.get("bookingId");

    // Initialize state lazily to avoid hydration mismatch
    const [bookingId, setBookingId] = useState(null);
    const [isBookingPayment, setIsBookingPayment] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Safe localStorage access
        let storedBookingId = null;
        try {
            storedBookingId = localStorage.getItem("pendingBookingPaymentId");
        } catch (e) {
            console.error("Storage access error", e);
        }

        const finalBookingId = urlBookingId || storedBookingId;

        console.log("DEBUG: Callback Init", { reference, finalBookingId });

        if (reference) {
            if (finalBookingId) {
                setBookingId(finalBookingId);
                setIsBookingPayment(true);
                handleBookingVerification(finalBookingId, reference);
            } else {
                setShowModal(true);
            }
        } else {
            // navigate("/dashboard/settings");
        }
    }, [reference, urlBookingId]);

    const handleBookingVerification = async (currentBookingId, ref) => {
        if (!ref) return;
        if (isProcessing) return;

        try {
            setIsProcessing(true);
            toast.loading("Verifying booking payment...", { id: "verify-booking" });

            await verifyPayment(ref);

            toast.success("Payment verified!", { id: "verify-booking" });
            localStorage.removeItem("pendingBookingPaymentId");

            setTimeout(() => {
                navigate(`/bookings/summary?bookingId=${currentBookingId}&payment_success=true&reference=${ref}`);
            }, 1000);
        } catch (error) {
            console.error("Booking verification failed:", error);
            // Even if verification "fails" (e.g. 404 from double verify),
            // if we have a booking ID, let's try to go back to the summary
            // so the user isn't stuck on a white screen.
            setTimeout(() => {
                navigate(`/bookings/summary?bookingId=${currentBookingId}&payment_success=true&reference=${ref}`);
            }, 2000);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleWalletSuccess = () => {

        navigate("/dashboard/settings?payment_success=true");
    };

    const handleClose = () => {
        setShowModal(false);
        navigate("/dashboard/settings");
    };


    // SIMPLE RENDER TO MATCH MODAL STYLE
    if (isBookingPayment) {
        return (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col items-center justify-center py-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Payment Verification</h2>
                    <div className="w-16 h-16 text-[#005823] animate-spin mb-4">
                        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <p className="text-center text-gray-700 text-lg font-medium">
                        Verifying your payment...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <PaymentConfirmationModal
            isOpen={showModal}
            reference={reference}
            onClose={handleClose}
            onSuccess={handleWalletSuccess}
        />
    );
}
