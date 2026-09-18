export default function BeautyPasswordTab() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Password</h2>
      <p className="text-sm text-gray-600 mb-6">Update and recover your password here</p>

      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Old Password</label>
          <input
            name="oldPassword"
            placeholder="Enter your current password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
          <input
            name="newPassword"
            placeholder="Enter your new password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <input
            name="confirmPassword"
            placeholder="Re-enter your new password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-gray-50"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showPassword"
            className="w-4 h-4 text-[#005823] border-gray-300 rounded focus:ring-[#8BC53F]"
          />
          <label htmlFor="showPassword" className="text-sm text-gray-700">
            Show password
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            className="flex-1 px-4 py-2 sm:px-6 sm:py-3 border border-gray-300 text-gray-700 text-sm sm:text-base font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 sm:px-6 sm:py-3 bg-[#005823] text-white text-sm sm:text-base font-medium rounded-lg hover:bg-[#004019] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            Update password
          </button>
        </div>
      </form>
    </div>
  );
}