export default function Invite() {
  return (
    <form className="flex justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-4xl rounded-[28px] bg-white px-6 py-8 shadow-[0_12px_40px_rgba(0,0,0,0.12)] ring-1 ring-black/10 sm:px-8 sm:py-10">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          Invite Driver
        </h2>

        <p className="mt-4 max-w-2xl text-lg leading-7 text-gray-600">
          Enter a registered driver&apos;s ID to send a fleet invitation.
          They&apos;ll need to accept before joining your fleet.
        </p>

        <div className="mt-10">
          <label htmlFor="driver-id" className="sr-only">
            Driver ID
          </label>
          <div className="flex items-center rounded-2xl border border-gray-300 bg-white px-5 py-4 shadow-sm focus-within:border-[#2f855a] focus-within:ring-2 focus-within:ring-[#2f855a]/20">
            <input
              id="driver-id"
              name="driver-id"
              type="text"
              placeholder="e.g. SGD-284961"
              className="block w-full bg-transparent text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-2xl bg-[#3b8558] px-6 py-5 text-lg font-medium text-white shadow-[0_10px_25px_rgba(59,133,88,0.25)] transition-transform duration-200 hover:scale-[1.01] hover:bg-[#33754d] active:scale-[0.99]"
          >
            Send Invite
          </button>
        </div>
      </div>
    </form>
  )
}
