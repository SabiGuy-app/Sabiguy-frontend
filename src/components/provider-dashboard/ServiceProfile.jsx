import { Pencil, Trash2, Save } from "lucide-react";
import AddService from "../../pages/signup/ServiceProvider/AccountSetup/SkillsSection/AddService";
import { useState, useEffect, useRef } from "react";
import { IoIosArrowBack, IoIosAdd } from "react-icons/io";
import { updateProviderBankInfo, updateProviderWorkVisuals } from "../../api/provider";
import { jobTitles, allServices } from "../../pages/signup/ServiceProvider/AccountSetup/SkillsSection/jobData";
import api from "../../api/axios";
import toast from "react-hot-toast";
import UploadBox from "../uploadBox";
import { useAuthStore } from "../../stores/auth.store";

export default function ProviderServiceProfileTab({ profile, onProfileUpdate }) {
  const { user, updateUser } = useAuthStore();
  const [addService, setAddService] = useState(false)
  const [editingService, setEditingService] = useState(null);
  const [isSavingService, setIsSavingService] = useState(false);

  // Real services from user data (populated during signup via POST /provider/job-service)
  const [services, setServices] = useState(() => {
    const userServices = user?.data?.service || [];
    return userServices.map((s, i) => ({
      id: i,
      name: s.serviceName || s.name || "",
      price: s.price || 0,
      pricingModel: s.pricingModel || "fixed",
      pricingModelLabel: s.pricingModel || "fixed",
    }));
  });

  // Persist services to backend via POST /provider/job-service
  const saveServicesToBackend = async (updatedServices) => {
    setIsSavingService(true);
    try {
      const payload = {
        job: user?.data?.job || [],
        service: updatedServices.map((s) => ({
          serviceName: s.name,
          pricingModel: s.pricingModel || s.pricingModelLabel || "fixed",
          price: s.price,
        })),
      };

      await api.post("/provider/job-service", payload);

      // Update local store
      updateUser({
        data: {
          ...user.data,
          service: payload.service,
        },
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update services");
      throw error;
    } finally {
      setIsSavingService(false);
    }
  };

  const handleEditService = (service, index) => {
    setEditingService({ ...service, index });
    setAddService(true);
  };

  const handleDeleteService = async (index) => {
    const updatedServices = services.filter((_, i) => i !== index);
    try {
      await saveServicesToBackend(updatedServices);
      setServices(updatedServices);
      toast.success("Service removed");
    } catch {
      // Error already handled in saveServicesToBackend
    }
  };

  const handleSaveService = async (newService) => {
    let updatedServices;
    if (editingService) {
      updatedServices = services.map((s, i) =>
        i === editingService.index ? newService : s
      );
      setEditingService(null);
    } else {
      updatedServices = [...services, newService];
    }

    try {
      await saveServicesToBackend(updatedServices);
      setServices(updatedServices);
      setAddService(false);
      toast.success(editingService ? "Service updated" : "Service added");
    } catch {
      // Error already handled
    }
  };

  const [bankInfo, setBankInfo] = useState({
    bankName: profile?.bankName || "",
    accountNumber: profile?.accountNumber || "",
    accountName: profile?.accountName || "",
    bankCode: profile?.bankCode || "",
  });
  const [isSavingBank, setIsSavingBank] = useState(false);

  // --- Work Visuals State ---
  // Safely extract from profile.workVisuals if exists
  const initialPictures = profile?.workVisuals?.[0]?.pictures || [];
  const initialVideos = profile?.workVisuals?.[0]?.videos || [];

  const [videos, setVideos] = useState(initialVideos);
  const [pictures, setPictures] = useState(initialPictures);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [isSavingVisuals, setIsSavingVisuals] = useState(false);

  // --- Bank Verification State ---
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [searchQuery, setSearchQuery] = useState(profile?.bankName || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const [verifyingAccount, setVerifyingAccount] = useState(false);
  const [wasJustVerified, setWasJustVerified] = useState(false);
  const verifyAbortRef = useRef(null);
  const bankDropdownRef = useRef(null);

  // Click-outside handler for bank dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bankDropdownRef.current && !bankDropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  // Fetch banks on mount
  useEffect(() => {
    const fetchBanks = async () => {
      setLoadingBanks(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/payment/banks`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          const bankList = data.data.map(bank => ({ name: bank.name, code: bank.code }));
          setBanks(bankList);

          // Auto-resolve bankCode if it was missing from backend profile
          if (profile?.bankName && !profile?.bankCode) {
            const matchedBank = bankList.find(b => b.name.toLowerCase() === profile.bankName.toLowerCase());
            if (matchedBank) {
              setBankInfo(prev => ({ ...prev, bankCode: matchedBank.code }));
            }
          }
        }
      } catch (error) {
        console.error("Fetch banks error:", error);
      } finally {
        setLoadingBanks(false);
      }
    };
    fetchBanks();
  }, []);

  const filteredBanks = banks.filter(bank =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const verifyAccountNumber = async (accountNumber, bankCode) => {
    if (!accountNumber || !bankCode || accountNumber.length !== 10) {
      setBankInfo(prev => ({ ...prev, accountName: "" }));
      setWasJustVerified(false);
      return;
    }

    // Cancel any in-flight verification request
    if (verifyAbortRef.current) {
      verifyAbortRef.current.abort();
    }
    const controller = new AbortController();
    verifyAbortRef.current = controller;

    setVerifyingAccount(true);
    setWasJustVerified(false);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/payment/verify-bank`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ accountNumber, bankCode }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errMsg = data.message || `Server returned ${response.status} error`;
        setBankInfo(prev => ({ ...prev, accountName: "" }));
        toast.error(errMsg);
        return;
      }

      const fetchedName = data.data?.accountName;
      if (fetchedName) {
        setBankInfo(prev => ({ ...prev, accountName: fetchedName }));
        setWasJustVerified(true);
      } else {
        setBankInfo(prev => ({ ...prev, accountName: "" }));
        toast.error("Could not retrieve account name.");
      }
    } catch (error) {
      if (error.name === "AbortError") return;
      console.error("Verification error:", error);
      setBankInfo(prev => ({ ...prev, accountName: "" }));
      toast.error("Verification service unavailable. Please try again.");
    } finally {
      setVerifyingAccount(false);
    }
  };

  const handleBankSelect = (bank) => {
    setBankInfo(prev => ({ ...prev, bankName: bank.name, bankCode: bank.code }));
    setSearchQuery(bank.name);
    setShowDropdown(false);

    if (bankInfo.accountNumber.length === 10) {
      verifyAccountNumber(bankInfo.accountNumber, bank.code);
    }
  };

  const handleAccountNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setBankInfo(prev => ({ ...prev, accountNumber: value }));

    if (value.length === 10 && bankInfo.bankCode) {
      verifyAccountNumber(value, bankInfo.bankCode);
    } else if (value.length !== 10) {
      setBankInfo(prev => ({ ...prev, accountName: "" }));
      setWasJustVerified(false);
    }
  };

  const email = profile?.email || localStorage.getItem("email");
  const uploadEndpoint = `${import.meta.env.VITE_BASE_URL}/file/${email}/work_visuals`;

  const handleBankConfigChange = (e) => {
    const { name, value } = e.target;
    setBankInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveBankInfo = async () => {
    try {
      if (!bankInfo.bankName || !bankInfo.accountNumber || !bankInfo.accountName) {
        toast.error("Please fill all bank details");
        return;
      }
      setIsSavingBank(true);
      await updateProviderBankInfo({
        accountName: bankInfo.accountName,
        accountNumber: bankInfo.accountNumber,
        bankName: bankInfo.bankName,
        bankCode: bankInfo.bankCode,
      });

      if (user && user.data) {
        updateUser({
          data: {
            ...user.data,
            accountName: bankInfo.accountName,
            accountNumber: bankInfo.accountNumber,
            bankName: bankInfo.bankName,
            bankCode: bankInfo.bankCode,
          }
        });
      }

      toast.success("Bank info updated successfully");
    } catch (error) {
      console.error("Failed to update bank info:", error);
      toast.error(error?.response?.data?.message || "Failed to update internal bank info");
    } finally {
      setIsSavingBank(false);
    }
  };

  const handleSaveWorkVisuals = async () => {
    try {
      setIsSavingVisuals(true);
      await updateProviderWorkVisuals({
        workVisuals: [
          {
            pictures,
            videos,
          }
        ]
      });

      // Update global store locally so UI reacts
      if (user && user.data) {
        updateUser({
          data: {
            ...user.data,
            workVisuals: [
              {
                pictures,
                videos,
              }
            ]
          }
        });
      }

      toast.success("Work visuals updated successfully");
    } catch (error) {
      console.error("Failed to update work visuals:", error);
      toast.error(error?.response?.data?.message || "Failed to save gallery");
    } finally {
      setIsSavingVisuals(false);
    }
  };

  // --- Job Info State (Work Category, Sub-Category, Tagline) ---
  const [jobInfo, setJobInfo] = useState({
    workCategory: profile?.workCategory || "",
    subCategory: profile?.subCategory || "",
    tagLine: profile?.tagLine || "",
  });
  const [isSavingJob, setIsSavingJob] = useState(false);
  const [jobInfoDirty, setJobInfoDirty] = useState(false);

  const handleJobInfoChange = (e) => {
    const { name, value } = e.target;
    setJobInfo((prev) => ({ ...prev, [name]: value }));
    setJobInfoDirty(true);
  };

  const handleSaveJobInfo = async () => {
    setIsSavingJob(true);
    try {
      const currentJobs = user?.data?.job || [];
      const updatedJob = {
        service: jobInfo.workCategory,
        title: jobInfo.subCategory,
        tagLine: jobInfo.tagLine,
        startingPrice: currentJobs[0]?.startingPrice || "0",
      };

      // Replace first job or create new one
      const updatedJobs = currentJobs.length > 0
        ? [updatedJob, ...currentJobs.slice(1)]
        : [updatedJob];

      const payload = {
        job: updatedJobs,
        service: user?.data?.service || [],
      };

      await api.post("/provider/job-service", payload);

      updateUser({
        data: {
          ...user.data,
          job: updatedJobs,
        },
      });

      toast.success("Work info updated!");
      setJobInfoDirty(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update work info");
    } finally {
      setIsSavingJob(false);
    }
  };

  return (
    <div className="mb-12">

      <form className="space-y-6">


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Category
          </label>
          <select
            name="workCategory"
            value={jobInfo.workCategory}
            onChange={(e) => {
              const value = e.target.value;
              setJobInfo((prev) => ({ ...prev, workCategory: value, subCategory: "" }));
              setJobInfoDirty(true);
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-gray-50"
          >
            {jobTitles.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sub-Category
          </label>
          <select
            name="subCategory"
            value={jobInfo.subCategory}
            onChange={handleJobInfoChange}
            disabled={!jobInfo.workCategory}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select Sub-Category</option>
            {(allServices[jobInfo.workCategory] || []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tagline/Headline
          </label>
          <input
            type="text"
            name="tagLine"
            value={jobInfo.tagLine}
            onChange={handleJobInfoChange}
            placeholder="e.g. Flawless beauty for your special day"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-gray-50"
          />
        </div>

        {jobInfoDirty && (
          <button
            type="button"
            onClick={handleSaveJobInfo}
            disabled={isSavingJob}
            className="px-6 py-2.5 bg-[#005823] text-white font-medium rounded-lg hover:bg-[#004019] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSavingJob ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Work Info
              </>
            )}
          </button>
        )}

        {/* Add your Services & Pricing — commented out
        <div>
          <p className="font-semibold text-xl">Add your Services &amp; Pricing</p>
          <p>List the services you offer and set fair prices so customers know what to expect.</p>
          <div className="flex flex-col gap-3 mt-3">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-between border border-gray-300 rounded-lg p-3 shadow-sm bg-white"
              >
                <div>
                  <h3 className="font-semibold text-lg">{service.name}</h3>
                  <p className="text-green-700 font-semibold">
                    ₦{service.price}
                    <span className="text-gray-500 font-normal ml-2">
                      • {service.pricingModelLabel}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <Pencil className="w-4 h-4 cursor-pointer hover:text-gray-700"
                    onClick={() => handleEditService(service, index)}
                  />
                  <Trash2
                    className="w-4 h-4 cursor-pointer hover:text-red-600"
                    onClick={() => handleDeleteService(index)}
                  />
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="flex item-center justify-center w-full mt-3 gap-1 border border-gray-300 rounded-md  py-1 font-semibold text-gray-700 bg-white hover:bg-[#8BC53FBF] transition"
            onClick={() => setAddService(true)}>
            <IoIosAdd size={25} className=" text-gray-600" />
            <span>Add New Service</span>
          </button>
        </div>
        <h3 className="font-semibold border-t border-gray-300"></h3>
        */}


        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="font-semibold text-lg">Portfolio/Work Gallery</h2>
              <p className="text-sm text-gray-500">Showcase photos and videos of your best work</p>
            </div>
            <button
              type="button"
              onClick={handleSaveWorkVisuals}
              disabled={isSavingVisuals || isUploadingMedia}
              className="px-4 sm:px-5 py-2 bg-[#005823] text-white font-medium rounded-lg hover:bg-[#004019] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
            >
              {isSavingVisuals ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save size={16} />
              )}
              Save Gallery
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Videos</h3>
              {videos.length === 0 && (
                <UploadBox
                  uploadEndpoint={uploadEndpoint}
                  accept="video/*"
                  multiple={false}
                  onUploadComplete={(urls) => setVideos((prev) => [...prev, ...urls])}
                  onUploadStart={() => setIsUploadingMedia(true)}
                  onUploadEnd={() => setIsUploadingMedia(false)}
                />
              )}
              {videos.length > 0 && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                  {videos.map((vid, idx) => (
                    <div key={idx} className="relative group">
                      <video
                        src={vid}
                        controls
                        className="w-full h-32 sm:h-40 object-cover rounded-lg border bg-black"
                      />
                      <button
                        type="button"
                        onClick={() => setVideos(v => v.filter((_, i) => i !== idx))}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600 shadow"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <div className="col-span-1">
                    <UploadBox
                      uploadEndpoint={uploadEndpoint}
                      accept="video/*"
                      multiple={false}
                      onUploadComplete={(urls) => setVideos((prev) => [...prev, ...urls])}
                      onUploadStart={() => setIsUploadingMedia(true)}
                      onUploadEnd={() => setIsUploadingMedia(false)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Pictures</h3>
              {pictures.length === 0 && (
                <UploadBox
                  uploadEndpoint={uploadEndpoint}
                  accept="image/*"
                  multiple={true}
                  onUploadComplete={(urls) => setPictures((prev) => [...prev, ...urls])}
                  onUploadStart={() => setIsUploadingMedia(true)}
                  onUploadEnd={() => setIsUploadingMedia(false)}
                />
              )}
              {pictures.length > 0 && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                  {pictures.map((pic, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={pic}
                        alt="portfolio"
                        className="w-full h-32 sm:h-40 object-cover rounded-lg border shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setPictures(p => p.filter((_, i) => i !== idx))}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600 shadow"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <div className="col-span-1">
                    <UploadBox
                      uploadEndpoint={uploadEndpoint}
                      accept="image/*"
                      multiple={true}
                      onUploadComplete={(urls) => setPictures((prev) => [...prev, ...urls])}
                      onUploadStart={() => setIsUploadingMedia(true)}
                      onUploadEnd={() => setIsUploadingMedia(false)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Bank Account Details</h2>
          <p className="text-sm text-gray-500 mb-6">Setup where you receive your payouts</p>

          <div className="space-y-4">
            {/* Bank Name with Dropdown */}
            <div className="relative" ref={bankDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name
              </label>
              <input
                type="text"
                placeholder={loadingBanks ? "Loading banks..." : "Search for your bank"}
                value={searchQuery}
                disabled={loadingBanks}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                  if (e.target.value !== bankInfo.bankName) {
                    setBankInfo(prev => ({ ...prev, bankCode: "", accountName: "" }));
                  }
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-gray-50"
              />

              {showDropdown && searchQuery && filteredBanks.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredBanks.map((bank) => (
                    <div
                      key={bank.code}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleBankSelect(bank);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {bank.name}
                    </div>
                  ))}
                </div>
              )}
              {showDropdown && searchQuery && filteredBanks.length === 0 && !loadingBanks && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg px-4 py-2 text-gray-500">
                  No banks found
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={bankInfo.accountNumber}
                  onChange={handleAccountNumberChange}
                  placeholder="Enter 10-digit account number"
                  disabled={!bankInfo.bankCode}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-gray-50 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={bankInfo.accountName}
                  disabled={true}
                  placeholder={verifyingAccount ? "Verifying..." : "Auto-filled after verification"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-gray-100 text-gray-700 disabled:cursor-not-allowed"
                />
                {verifyingAccount && (
                  <p className="text-blue-500 text-sm mt-1">⏳ Verifying account number...</p>
                )}
                {bankInfo.accountName && !verifyingAccount && wasJustVerified && (
                  <p className="text-green-600 text-sm mt-1">✓ Account verified</p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={handleSaveBankInfo}
                disabled={isSavingBank || !bankInfo.accountName || verifyingAccount}
                className="px-6 py-2.5 bg-[#005823] text-white font-medium rounded-lg hover:bg-[#004019] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSavingBank ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save size={18} />
                )}
                Save Bank Details
              </button>
            </div>
          </div>
        </div>
        <AddService
          isOpen={addService}
          onClose={() => {
            setAddService(false);
            setEditingService(null);
          }}
          onSave={handleSaveService}
          editingService={editingService}
        />
      </form>
    </div>
  );
}