import React from "react";
import { Instagram, Linkedin, Facebook } from "lucide-react";

const LandingFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
      <div className="w-[90%] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 mb-4">
          <div className="flex flex-col gap-6 lg:w-[40%]">
            <img src="/logo.jpg" alt="SabiGuy Logo" className="h-10 w-fit" />
            <p className="text-[#231F20] text[16px] leading-relaxed">
              Connecting you with trusted local service providers.
            </p>
            <div className="flex gap-4 items-center text-[#1A1A1A]">
              <a
                href="https://www.facebook.com/profile.php?id=61582188390597"
                className="hover:text-[#31784D] transition-colors"
              >
                <img
                  src="/home/facebook.png"
                  alt=""
                  className="w-[25px] h-[25px]"
                />
              </a>
              <a
                href="https://www.instagram.com/sabiguyapp/"
                className="hover:text-[#31784D] transition-colors"
              >
                <img
                  src="/home/instagram.png"
                  alt=""
                  className="w-[25px] h-[25px]"
                />
              </a>
              <a
                href="https://www.linkedin.com/showcase/sabiguy/"
                className="hover:text-[#31784D] transition-colors"
              >
                <img
                  src="/home/linkedin.png"
                  alt=""
                  className="w-[25px] h-[25px]"
                />
              </a>
              <a
                href="https://x.com/sabiguyapp"
                className="hover:text-[#31784D] transition-colors font-bold text-lg"
              >
                <img src="/home/X.png" alt="" className="w-[25px] h-[25px]" />
              </a>
            </div>
          </div>

          <div className="lg:flex justify-between space-y-5">
            <div>
              <h4 className="font-semibold text-[20px] text-[#231F20] mb-3">
                Company
              </h4>
              <ul className="flex flex-col gap-4 text-[#231F20]">
                <li>
                  <a href="#" className="hover:text-[#31784D]">
                    About us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#31784D]">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#31784D]">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[20px] text-[#231F20] mb-3">
                Services
              </h4>
              <ul className="flex flex-col gap-4 text-[#231F20]">
                <li>
                  <a href="#" className="hover:text-[#31784D]">
                    Dispatch
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#31784D]">
                    Errands
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#31784D]">
                    Home Services
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[20px] text-[#231F20] mb-3">
                Support
              </h4>
              <ul className="flex flex-col gap-4 text-[#231F20]">
                <li>
                  <a href="#" className="hover:text-[#31784D]">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#31784D]">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 pb-2 border-b border-[#231F2080]/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] lg:text-[16px] text-[#231F20]">
          <p>© {currentYear} SabiGuy. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-[#31784D]">
              Terms & Conditions
            </a>
            <a href="#" className="hover:text-[#31784D]">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
