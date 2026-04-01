import { useEffect, useState } from "react";
import { X, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { verifyPayment as verifyPaymentAPI } from "../../api/payment";

const PaymentConfirmationModal = ({ isOpen, reference, onClose, onSuccess, verifyFn }) => {
    const [status, setStatus] = useState("verifying");
    const [message, setMessage] = useState("Verifying your payment...");

    // Use custom verify function if provided, otherwise fall back to default
    const verify = verifyFn || verifyPaymentAPI;

    useEffect(() => {
        if (isOpen && reference) {
            handleVerify();
        }
    }, [isOpen, reference]);

    const handleVerify = async () => {
        try {
            setStatus("verifying");
            setMessage("Verifying your payment...");

            const data = await verify(reference);

            if (data.success) {
                setStatus("success");
                setMessage("Your payment has been confirmed!");
                if (onSuccess) {
                    setTimeout(() => {
                        onSuccess();
                    }, 2000);
                }
            } else {
                setStatus("error");
                setMessage(data.message || "Payment verification failed");
            }
        } catch (error) {
            // Handle already-verified (double redirect) as success
            const statusCode = error?.response?.status;
            if (statusCode === 404 || statusCode === 409) {
                setStatus("success");
                setMessage("Payment already verified!");
                if (onSuccess) {
                    setTimeout(() => {
                        onSuccess();
                    }, 2000);
                }
            } else {
                setStatus("error");
                setMessage(error?.response?.data?.message || "Failed to verify payment. Please contact support.");
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Payment Verification
                    </h2>
                    {status !== "verifying" && (
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                <div className="flex flex-col items-center justify-center py-8">
                    {status === "verifying" && (
                        <Loader2 className="w-16 h-16 text-[#005823] animate-spin mb-4" />
                    )}

                    {status === "success" && (
                        <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
                    )}

                    {status === "error" && (
                        <XCircle className="w-16 h-16 text-red-600 mb-4" />
                    )}

                    <p className="text-center text-gray-700 text-lg font-medium">
                        {message}
                    </p>

                    {status === "success" && (
                        <p className="text-center text-gray-500 text-sm mt-2">
                            Your wallet balance will be updated shortly
                        </p>
                    )}
                </div>

                {status === "error" && (
                    <button
                        onClick={onClose}
                        className="w-full bg-[#005823CC] hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                )}
            </div>
        </div>
    );
};

export default PaymentConfirmationModal;
