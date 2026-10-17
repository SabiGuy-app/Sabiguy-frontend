import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function BeautyPasswordTab() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordFieldClass =
    "w-full px-4 py-3 pr-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-gray-50";

  const allPasswordsVisible =
    showOldPassword && showNewPassword && showConfirmPassword;

  const toggleAllPasswords = () => {
    const next = !allPasswordsVisible;
    setShowOldPassword(next);
    setShowNewPassword(next);
    setShowConfirmPassword(next);
  };

  const EyeToggle = ({ show, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
      aria-label={show ? "Hide password" : "Show password"}
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Password</h2>
      <p className="text-sm text-gray-600 mb-6">Update and recover your password here</p>

      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Old Password</label>
          <div className="relative">
            <input
              type={showOldPassword ? "text" : "password"}
              name="oldPassword"
              placeholder="Enter your current password"
              className={passwordFieldClass}
            />
            <EyeToggle
              show={showOldPassword}
              onToggle={() => setShowOldPassword((prev) => !prev)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              placeholder="Enter your new password"
              className={passwordFieldClass}
            />
            <EyeToggle
              show={showNewPassword}
              onToggle={() => setShowNewPassword((prev) => !prev)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Re-enter your new password"
              className={passwordFieldClass}
            />
            <EyeToggle
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((prev) => !prev)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showPassword"
            checked={allPasswordsVisible}
            onChange={toggleAllPasswords}
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