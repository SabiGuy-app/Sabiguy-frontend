export default function AuthLayout({ title, description, children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Side */}
      <div className="w-full md:w-[35%] bg-[#005823] text-white flex flex-col justify-center items-center px-6 py-16 md:py-0 text-center md:text-left">
        <div className="max-w-md text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
            {title}
          </h1>
          <p className="font-medium sm:font-semibold leading-relaxed">
            {description}
          </p>
        </div>
        </div>

      {/* Right Side */}
      <div className="w-full md:w-[65%] bg-white flex justify-center items-center px-6 sm:px-10 py-10 md:py-0">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
