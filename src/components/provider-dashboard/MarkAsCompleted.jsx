import UploadBox from "../uploadBox";
import { ChevronLeft, Loader2 } from "lucide-react";
import ReviewSent from "./ReviewSentModal";
import { useState } from "react";
import { markAsComplete } from "../../api/bookings";
import { uploadCompletionPhoto } from "../../api/completionPhotos";
import { toast } from "react-toastify";
import { useAuthStore } from "../../stores/auth.store";

import Button from "../button";

export default function MarkAsCompleted({ isOpen, onClose, job, onRefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPictures, setUploadingPictures] = useState(false);
  const [pictures, setPictures] = useState([]);
  const [jobCompletedNotes, setJobCompletedNotes] = useState("");
  const user = useAuthStore((state) => state.user);
  const email =
    user?.email || user?.data?.email || localStorage.getItem("email");

  if (!isOpen) return null;

  const uploadWorkPhoto = (file) => {
    if (!email)
      throw new Error("Provider email is unavailable for photo upload.");
    return uploadCompletionPhoto(email, file);
  };

  const handleMarkAsCompleted = async () => {
    if (uploadingPictures) return;
    setLoading(true);
    try {
      await markAsComplete(job.id, {
        pictures,
        videos: [],
        jobCompletedNotes: jobCompletedNotes.trim()
          ? [jobCompletedNotes.trim()]
          : [],
      });
      setShowModal(true);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Failed to mark job as complete:", error);
      toast.error(
        error.response?.data?.message || "Failed to mark job as complete",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-gray-50  bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-5 rounded-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className=" top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold">Review</h2>
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-lg">
              {" "}
              Upload Supporting Documents
            </h2>
            <p className="text-gray-500 mt-2">
              To mark this project completed, upload some of the work pictures
              for customer review
            </p>
          </div>

          <div className="mt-5 mb-4">
            <h3 className="font-semibold text-lg"> Work Photos</h3>
            <p className="text-gray-500 mt-2">
              Upload one or more photos (optional)
            </p>
          </div>
          <UploadBox
            accept="image/*"
            multiple
            maxFiles={3}
            maxSizeMB={5}
            uploadFile={uploadWorkPhoto}
            onUploadComplete={(urls) => {
              setPictures((current) =>
                Array.from(new Set([...current, ...urls])),
              );
            }}
            onUploadStart={() => setUploadingPictures(true)}
            onUploadEnd={() => setUploadingPictures(false)}
            onError={(message) => toast.error(message)}
            disabled={loading}
            formatHint="JPEG, PNG, or other image formats up to 5 MB each"
          />
          {pictures.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              {pictures.length} photo{pictures.length === 1 ? "" : "s"} uploaded
            </p>
          )}

          <div>
            <textarea
              placeholder="Additional Notes (optional)"
              rows={4}
              value={jobCompletedNotes}
              onChange={(event) => setJobCompletedNotes(event.target.value)}
              className="w-full mt-7 mb-5 px-4 py-3 bg-gray-50 border border-gray-300 rounded-md placeholder:text-black resize-none focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent"
            />
          </div>
          <button
            onClick={handleMarkAsCompleted}
            disabled={loading || uploadingPictures}
            className="w-full mb-15 rounded-md p-3 bg-[#005823BF] text-white hover:bg-[#005823] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Mark as completed"
            )}
          </button>
        </div>
      </div>
      <ReviewSent isOpen={showModal} onClose={onClose} />
    </div>
  );
}
