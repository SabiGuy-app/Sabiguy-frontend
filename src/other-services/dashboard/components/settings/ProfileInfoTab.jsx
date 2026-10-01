const SAMPLE_USER = {
  fullName: "Lamine Yamal",
  email: "yamal.lamine@example.com",
  phoneNumber: "+234 801 234 5678",
  city: "Barcelona, Spain",
};

export default function BeautyProfileInfoTab() {
  const [firstName, ...rest] = SAMPLE_USER.fullName.split(" ");
  const lastName = rest.join(" ");

  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold text-gray-900 mt-5 mb-6">
        Personal Information
      </h2>

      <form className="space-y-6">
        {/* First Name and Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First name
            </label>
            <input
              type="text"
              defaultValue={firstName}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last name
            </label>
            <input
              type="text"
              defaultValue={lastName}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-gray-50"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            readOnly
            defaultValue={SAMPLE_USER.email}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-gray-50"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone number
          </label>
          <input
            type="tel"
            readOnly
            defaultValue={SAMPLE_USER.phoneNumber}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-gray-50"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            readOnly
            defaultValue={SAMPLE_USER.city}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-gray-50"
          />
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="button"
            className="px-8 py-3 bg-[#005823] text-white font-medium rounded-lg hover:bg-[#004019] transition-colors flex items-center gap-2"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}