import { useEffect, useRef, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import FaceCapture from "../../pages/signup/ServiceProvider/AccountSetup/FacialCapture";
import { updateUserProfile, verifyUserNin } from "../../api/user";
import { useAuthStore } from "../../stores/auth.store";
import { getUserRecord } from "../../utils/buyerKycStatus";

const NIN_LENGTH = 11;

export default function BuyerIdentityPrompt({ onComplete, onCancel }) {
  const user = useAuthStore((state) => state.user);
  const profile = getUserRecord(user) || {};
  const initialNin = String(profile.nin || "")
    .replace(/\D/g, "")
    .slice(0, NIN_LENGTH);
  const hasVerifiedNin =
    profile.ninVerified === true && /^\d{11}$/.test(initialNin);
  const [nin, setNin] = useState(initialNin);
  const [ninVerified, setNinVerified] = useState(hasVerifiedNin);
  const [stage, setStage] = useState(hasVerifiedNin ? "face" : "nin");
  const [verifyingNin, setVerifyingNin] = useState(false);
  const [ninError, setNinError] = useState("");
  const ninRequestRef = useRef(null);

  useEffect(
    () => () => {
      const request = ninRequestRef.current;
      ninRequestRef.current = null;
      request?.abort();
    },
    [],
  );

  const verifyNin = async (value) => {
    if (value.length !== NIN_LENGTH) return;

    ninRequestRef.current?.abort();
    const controller = new AbortController();
    ninRequestRef.current = controller;
    setVerifyingNin(true);
    setNinError("");

    try {
      const response = await verifyUserNin(value, {
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;

      if (
        response?.success !== true ||
        response?.data?.ninVerified !== true
      ) {
        setNinError(response?.message || "Unable to verify your NIN.");
        return;
      }

      setNinVerified(true);
      setStage("face");
    } catch (error) {
      if (controller.signal.aborted) return;
      setNinError(
        error?.response?.data?.message ||
          "Unable to verify your NIN. Please try again.",
      );
    } finally {
      if (ninRequestRef.current === controller) {
        ninRequestRef.current = null;
        setVerifyingNin(false);
      }
    }
  };

  const handleNinChange = (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, NIN_LENGTH);
    if (value === nin) return;

    ninRequestRef.current?.abort();
    ninRequestRef.current = null;
    setVerifyingNin(false);
    setNinVerified(false);
    setNinError("");
    setNin(value);

    if (value.length === NIN_LENGTH) {
      verifyNin(value);
    }
  };

  const saveBuyerProfile = async (facialCapture) => {
    if (!ninVerified || nin.length !== NIN_LENGTH) {
      throw new Error("Verify your NIN before saving your facial capture.");
    }

    const response = await updateUserProfile({ nin, facialCapture });
    if (response?.success === false) {
      throw new Error(response.message || "Unable to save your profile.");
    }

    useAuthStore.getState().updateUser((currentUser) => {
      if (!currentUser) return currentUser;
      const verifiedProfile = {
        ninVerified: true,
        facialCapture,
      };

      if (currentUser.data) {
        return {
          ...currentUser,
          data: { ...currentUser.data, ...verifiedProfile },
        };
      }

      if (currentUser.user) {
        return {
          ...currentUser,
          user: { ...currentUser.user, ...verifiedProfile },
        };
      }

      return { ...currentUser, ...verifiedProfile };
    });

    return { success: true };
  };

  if (stage === "face") {
    return (
      <div className="fixed inset-0 z-[120] overflow-y-auto bg-white">
        <p
          role="status"
          className="fixed left-1/2 top-3 z-[130] flex -translate-x-1/2 items-center gap-1 rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 shadow"
        >
          <CheckCircle2 size={16} aria-hidden="true" />
          NIN verified
        </p>
        <FaceCapture
          data={{}}
          onBack={() => setStage("nin")}
          onNext={onComplete}
          onSaveCapture={saveBuyerProfile}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="buyer-identity-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2
              id="buyer-identity-title"
              className="text-xl font-semibold text-gray-900"
            >
              Verify your identity
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Verify your NIN and capture your face to continue.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            aria-label="Close identity verification"
          >
            <X size={20} />
          </button>
        </div>

        <label
          htmlFor="buyer-identity-nin"
          className="mb-1.5 block text-sm font-medium text-gray-800"
        >
          National Identification Number (NIN)
        </label>
        <input
          id="buyer-identity-nin"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={NIN_LENGTH}
          value={nin}
          onChange={handleNinChange}
          placeholder="Enter your 11-digit NIN"
          disabled={ninVerified}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#34805A] focus:outline-none focus:ring-2 focus:ring-[#34805A]/20 disabled:bg-gray-50"
        />

        {verifyingNin && (
          <p className="mt-2 text-sm text-gray-500">Verifying NIN...</p>
        )}
        {ninVerified && (
          <p className="mt-2 flex items-center gap-1 text-sm text-green-700">
            <CheckCircle2 size={16} aria-hidden="true" />
            NIN verified
          </p>
        )}
        {ninError && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {ninError}
          </p>
        )}

        {!ninVerified && (
          <button
            type="button"
            onClick={() => verifyNin(nin)}
            disabled={verifyingNin || nin.length !== NIN_LENGTH}
            className="mt-5 w-full rounded-lg bg-[#34805A] px-4 py-3 font-semibold text-white hover:bg-[#2d6f4f] disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {verifyingNin ? "Verifying..." : "Verify NIN"}
          </button>
        )}
        {ninVerified && (
          <button
            type="button"
            onClick={() => setStage("face")}
            className="mt-5 w-full rounded-lg bg-[#34805A] px-4 py-3 font-semibold text-white hover:bg-[#2d6f4f]"
          >
            Continue to face capture
          </button>
        )}
      </section>
    </div>
  );
}
