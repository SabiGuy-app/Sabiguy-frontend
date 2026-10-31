import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { getAuthProfiles, switchProfile } from "../../api/auth";
import { useAuthStore } from "../../stores/auth.store";

const unwrap = (response) => response?.data?.data || response?.data || response;
const roleName = (role) => (String(role || "").toLowerCase().includes("business") ? "business" : String(role || "").toLowerCase());

function checkKycInBackground(role, email) {
  if (!email) return;
  const endpoint = role === "provider" ? "/provider/kyc-level" : "/businesses/kyc-level";
  api.post(endpoint, { email }).then(({ data }) => {
    const result = data?.data || data;
    const token = result?.token || result?.accessToken;
    if (token) {
      localStorage.setItem("token", token);
      useAuthStore.getState().setToken(token);
    }
    const level = result?.kycLevel ?? result?.level;
    localStorage.setItem("switchProfileKycCheck", JSON.stringify({
      role,
      email,
      checkedAt: new Date().toISOString(),
      kycLevel: level ?? null,
      kycCompleted: result?.kycCompleted ?? null,
    }));
  }).catch((error) => {
    console.warn("Background KYC lookup failed after profile switch:", error?.message);
  });
}

export default function BuyerProfileSwitcher() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [targetRole, setTargetRole] = useState("provider");
  const [profileId, setProfileId] = useState("");
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken);
  const currentUser = useAuthStore((state) => state.user);

  const matches = useMemo(
    () => profiles.filter((profile) => roleName(profile.role) === targetRole),
    [profiles, targetRole],
  );

  const loadProfiles = async () => {
    setLoadingProfiles(true);
    setError("");
    try {
      const response = unwrap(await getAuthProfiles());
      const list = Array.isArray(response?.profiles) ? response.profiles : [];
      setProfiles(list);
      const firstMatch = list.find((profile) => roleName(profile.role) === targetRole);
      setProfileId(firstMatch?.profileId || "");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Could not load your profiles.");
    } finally {
      setLoadingProfiles(false);
    }
  };

  useEffect(() => {
    if (open) loadProfiles();
    // Load only when the switch dialog opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    setProfileId(matches[0]?.profileId || "");
  }, [targetRole, profiles]);

  const finishSwitch = async (response, selectedProfile) => {
    const result = unwrap(response);
    const token = result?.accessToken || result?.token || result?.data?.token;
    const refreshToken = result?.refreshToken || result?.data?.refreshToken;
    if (!token) throw new Error("The server did not return a new session token.");

    localStorage.setItem("token", token);
    setToken(token);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
      setRefreshToken(refreshToken);
    }

    const accountRole = roleName(result?.role || result?.user?.role || selectedProfile.role);
    const account = result?.user || result?.profile || selectedProfile;
    const accountData = account?.data || account;
    setUser({
      ...(currentUser || {}),
      ...account,
      role: accountRole,
      data: { ...(currentUser?.data || {}), ...accountData, role: accountRole },
    });

    const email = currentUser?.data?.email || currentUser?.email || selectedProfile.email || accountData?.email;
    if (accountRole === "provider") {
      checkKycInBackground("provider", email);
      navigate("/dashboard/provider", { replace: true });
      return;
    }

    if (accountRole === "business" || accountRole === "businessowner") {
      checkKycInBackground("business", email);
      const category = String(result?.businessCategory || accountData?.businessCategory || localStorage.getItem("businessCategory") || "").toLowerCase();
      navigate(category.includes("transport") ? "/business-provider/dashboard" : "/other-business-services/dashboard", { replace: true });
    }
  };

  const submitSwitch = async () => {
    if (!profileId || switching) return;
    setSwitching(true);
    setError("");
    try {
      const response = await switchProfile({
        targetRole,
        targetProfileId: profileId,
      });
      const selectedProfile = profiles.find((profile) => profile.profileId === profileId);
      await finishSwitch(response, selectedProfile);
      toast.success(`Switched to your ${targetRole} profile`);
      setOpen(false);
    } catch (requestError) {
      const message = requestError?.response?.data?.message || requestError?.message || "Could not switch profiles.";
      setError(message);
    } finally {
      setSwitching(false);
    }
  };

  const createAccount = () => {
    const email = currentUser?.data?.email || currentUser?.email;
    if (email) localStorage.setItem("email", email);
    localStorage.removeItem("kycLevel");
    localStorage.setItem("switchProfileOnboarding", targetRole);
    navigate(targetRole === "provider" ? "/service-provider/signup" : "/business-provider/signup");
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center justify-center rounded-lg border border-[#8BC53F] px-4 py-2 text-sm font-medium text-[#39751A] transition hover:bg-[#F4FAEC]">
        Switch profile
      </button>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}>
          <section role="dialog" aria-modal="true" aria-labelledby="switch-profile-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="switch-profile-title" className="text-lg font-semibold text-gray-900">Switch profile</h2>
                <p className="mt-1 text-sm text-gray-600">Choose another profile linked to your account.</p>
              </div>
              <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="text-2xl leading-none text-gray-400 hover:text-gray-700">×</button>
            </div>

            <label className="mt-5 block text-sm font-medium text-gray-700">Profile type</label>
            <select value={targetRole} onChange={(event) => setTargetRole(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="provider">Provider</option>
              <option value="business">Business</option>
            </select>

            {loadingProfiles ? <p className="mt-4 text-sm text-gray-500">Loading profiles…</p> : matches.length ? (
              <>
                <label className="mt-4 block text-sm font-medium text-gray-700">Your {targetRole} profile</label>
                <select value={profileId} onChange={(event) => setProfileId(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                  {matches.map((profile) => <option key={profile.profileId} value={profile.profileId}>{profile.fullName || profile.email || profile.profileId}</option>)}
                </select>

                <button type="button" disabled={switching} onClick={submitSwitch} className="mt-4 w-full rounded-lg bg-[#347B54] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{switching ? "Switching…" : `Switch to ${targetRole}`}</button>
              </>
            ) : !loadingProfiles && !error ? (
              <div className="mt-4 rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-700">No {targetRole} profile is linked to your account yet.</p>
                <button type="button" onClick={createAccount} className="mt-3 rounded-lg bg-[#347B54] px-4 py-2 text-sm font-semibold text-white">Create {targetRole} account</button>
              </div>
            ) : null}
            {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
          </section>
        </div>
      )}
    </>
  );
}
