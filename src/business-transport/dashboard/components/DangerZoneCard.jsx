import { useState } from "react";
import { AlertTriangle } from "lucide-react";

export default function DangerZoneCard() {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <div className="mt-4 rounded-xl border border-red-200 bg-white px-5 py-5 sm:px-6">
        <h3 className="text-base font-semibold text-red-600">Danger zone</h3>

        <div className="mt-4 divide-y divide-red-100">
          <div className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[#231F20]">Export all data</p>
              <p className="mt-0.5 text-xs text-[#918E8F]">Download drivers, trips and ledger as a backup</p>
            </div>
            <button
              type="button"
              className="rounded-md border border-[#CFCBCC] px-3.5 py-1.5 text-sm font-medium text-[#3D393A] hover:bg-gray-50"
            >
              Export
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-sm font-semibold text-red-600">Close business account</p>
              <p className="mt-0.5 text-xs text-[#918E8F]">Permanently closes the fleet and removes access</p>
            </div>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="rounded-md bg-red-600 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-red-700"
            >
              Close account
            </button>
          </div>
        </div>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-2 flex items-center gap-3">
              <AlertTriangle className="text-red-600" size={22} />
              <h2 className="text-lg font-semibold text-gray-800">Close business account?</h2>
            </div>
            <p className="mb-6 text-sm text-gray-500">
              This permanently closes your fleet and removes access for your whole team. This can't be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Close account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
