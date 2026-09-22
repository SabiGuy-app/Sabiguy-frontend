import { useNavigate } from "react-router-dom";
import NinUpload from "../signup/ServiceUser/nin-upload";

export default function BuyerNinUpload() {
  const navigate = useNavigate();

  return (
    <NinUpload
      onNext={() => navigate("/kyc/pending", { replace: true })}
      onBack={() => navigate("/login")}
    />
  );
}
