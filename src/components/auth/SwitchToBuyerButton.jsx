import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { switchToBuyer } from "../../api/auth";
import { useAuthStore } from "../../stores/auth.store";

function unwrapSwitchResponse(response) {
  const payload = response?.data?.data || response?.data || response;
  const identity = payload?.user || payload?.buyer || payload?.profile;
  const token = payload?.accessToken || payload?.token || identity?.token;
  const refreshToken = payload?.refreshToken || identity?.refreshToken;
  return { payload, identity, token, refreshToken };
}

export default function SwitchToBuyerButton({ className = "" }) {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken);
  const [switching, setSwitching] = useState(false);

  const handleSwitch = async () => {
    if (switching) return;
    setSwitching(true);
    try {
      const response = await switchToBuyer();
      const { payload, identity, token, refreshToken } = unwrapSwitchResponse(response);
      if (token) {
        localStorage.setItem("token", token);
        setToken(token);
      }
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
        setRefreshToken(refreshToken);
      }

      const source = identity || payload;
      const buyerData = source?.data || source?.user?.data || source;
      const previousData = currentUser?.data || currentUser || {};
      const nextUser = {
        ...(currentUser || {}),
        ...(source && typeof source === "object" ? source : {}),
        data: {
          ...previousData,
          ...(buyerData && typeof buyerData === "object" ? buyerData : {}),
          role: "buyer",
        },
        role: "buyer",
      };
      setUser(nextUser);
      toast.success("Switched to your buyer account");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not switch to your buyer account. Please try again.",
      );
    } finally {
      setSwitching(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSwitch}
      disabled={switching}
      className={`inline-flex items-center justify-center rounded-lg border border-[#8BC53F] px-4 py-2 text-sm font-medium text-[#39751A] transition hover:bg-[#F4FAEC] disabled:cursor-wait disabled:opacity-60 ${className}`}
    >
      {switching ? "Switching…" : "Switch to customer account"}
    </button>
  );
}
