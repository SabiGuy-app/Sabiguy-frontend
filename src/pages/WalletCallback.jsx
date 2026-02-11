import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaymentConfirmationModal from "../components/dashboard/PaymentConfirmationModal";

export default function WalletCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const reference = searchParams.get("reference");

    useEffect(() => {
        if (reference) {
            setShowModal(true);
        } else {
            navigate("/dashboard/settings");
        }
    }, [reference, navigate]);

    const handleSuccess = () => {
        navigate("/dashboard/settings?payment_success=true");
    };

    const handleClose = () => {
        setShowModal(false);
        navigate("/dashboard/settings");
    };

    return (
        <PaymentConfirmationModal
            isOpen={showModal}
            reference={reference}
            onClose={handleClose}
            onSuccess={handleSuccess}
        />
    );
}
