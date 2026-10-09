import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import PaymentConfirmationModal from "../components/dashboard/PaymentConfirmationModal";
import { verifyPayment } from "../api/payment";
import { verifyWalletFunding } from "../api/provider";
import { toast } from "react-hot-toast";

export default function WalletCallback() {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const reference = searchParams.get("reference") || searchParams.get("trxref") || "";
    const urlBookingId = searchParams.get("bookingId");

    const [isBookingPayment, setIsBookingPayment] = useState(false);
    const [verificationError, setVerificationError] = useState("");
    const [callbackBookingId, setCallbackBookingId] = useState("");
    const processingRef = useRef(false);

    // Detect if this is a wallet funding reference (starts with "FUND_")
    const isWalletFunding = reference.startsWith("FUND_") ||
        (location.pathname === "/wallet/funding/callback" && !reference.startsWith("PAY_"));

    const handleBookingVerification = useCallback(async (currentBookingId, ref) => {
        if (!currentBookingId || !ref || processingRef.current) return;

        processingRef.current = true;
        setVerificationError("");
        toast.loading("Verifying booking payment...", { id: "verify-booking" });

        try {
            const paymentKindKey = `pendingBookingPaymentKind:${currentBookingId}`;
            const isBeautyPayment = localStorage.getItem(paymentKindKey) === "beauty";
            await verifyPayment(ref, { strict: isBeautyPayment });
            localStorage.removeItem("pendingBookingPaymentId");
            localStorage.removeItem(paymentKindKey);
            toast.success("Payment verified!", { id: "verify-booking" });
            navigate(
                isBeautyPayment
                    ? "/bookings?tab=requests"
                    : `/bookings/summary?bookingId=${encodeURIComponent(currentBookingId)}&payment_success=true&reference=${encodeURIComponent(ref)}`,
                { replace: true },
            );
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || "Payment verification failed. Please try again.";
            setVerificationError(message);
            toast.error(message, { id: "verify-booking" });
        } finally {
            processingRef.current = false;
        }
    }, [navigate]);

    useEffect(() => {
        let storedBookingId = null;
        try {
            storedBookingId = localStorage.getItem("pendingBookingPaymentId");
        } catch (e) {
            console.error("Storage access error", e);
        }

        const finalBookingId = urlBookingId || storedBookingId;

        if (isWalletFunding) {
            setShowModal(true);
            return;
        }

        setIsBookingPayment(true);
        setCallbackBookingId(finalBookingId || "");
        if (!reference || !finalBookingId) {
            setVerificationError("The payment return is missing a reference or booking ID. Open your bookings and retry payment.");
            return;
        }
        handleBookingVerification(finalBookingId, reference);
    }, [handleBookingVerification, isWalletFunding, reference, urlBookingId]);

    const handleWalletSuccess = () => {
        navigate("/dashboard/settings?payment_success=true");
    };

    const handleClose = () => {
        setShowModal(false);
        navigate("/dashboard/settings");
    };

    if (isBookingPayment && verificationError) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
                    <h2 className="mb-3 text-xl font-semibold text-gray-900">Payment verification failed</h2>
                    <p className="mb-6 text-sm text-gray-600">{verificationError}</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {callbackBookingId && reference && (
                            <button type="button" onClick={() => handleBookingVerification(callbackBookingId, reference)} className="rounded-md bg-[#005823] px-5 py-3 font-medium text-white">
                                Retry verification
                            </button>
                        )}
                        <button type="button" onClick={() => navigate("/bookings?tab=requests")} className="rounded-md border border-gray-300 px-5 py-3 font-medium text-gray-700">
                            Back to bookings
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Booking payment — show spinner while verifying
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

    // Wallet funding — show PaymentConfirmationModal with correct verify function
    return (
        <PaymentConfirmationModal
            isOpen={showModal}
            reference={reference}
            onClose={handleClose}
            onSuccess={handleWalletSuccess}
            verifyFn={isWalletFunding ? verifyWalletFunding : verifyPayment}
        />
    );
}
