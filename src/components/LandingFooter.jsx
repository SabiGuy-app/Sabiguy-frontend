import React from "react";

const LandingFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#31784D] pt-16 pb-8 border-t border-[#255d3b]">
      <div className="w-[90%] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="flex flex-col gap-6 lg:w-[40%] items-center md:items-start text-center md:text-left">
            <img src="/SB%20white.png" alt="SabiGuy Logo" className="h-14 md:h-16 w-auto" />
            <p className="text-white/80 text-[16px] leading-relaxed">
              Connecting you with trusted local service providers.
            </p>
            <div className="flex gap-4 items-center justify-center md:justify-start">
              <a
                href="https://www.facebook.com/profile.php?id=61582188390597"
                className="hover:opacity-80 transition-opacity"
              >
                <img
                  src="/home/facebook.png"
                  alt="Facebook"
                  className="w-[25px] h-[25px] brightness-0 invert"
                />
              </a>
              <a
                href="https://www.instagram.com/sabiguyapp/"
                className="hover:opacity-80 transition-opacity"
              >
                <img
                  src="/home/instagram.png"
                  alt="Instagram"
                  className="w-[25px] h-[25px] brightness-0 invert"
                />
              </a>
              <a
                href="https://www.linkedin.com/showcase/sabiguy/"
                className="hover:opacity-80 transition-opacity"
              >
                <img
                  src="/home/linkedin.png"
                  alt="LinkedIn"
                  className="w-[25px] h-[25px] brightness-0 invert"
                />
              </a>
              <a
                href="https://x.com/sabiguyapp"
                className="hover:opacity-80 transition-opacity"
              >
                <img src="/home/X.png" alt="X" className="w-[25px] h-[25px] brightness-0 invert" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h4 className="font-semibold text-[20px] text-white mb-4">
                Company
              </h4>
              <ul className="flex flex-col gap-4 text-white/80">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[20px] text-white mb-4">
                Services
              </h4>
              <ul className="flex flex-col gap-4 text-white/80">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Dispatch
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Errands
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Home Services
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[20px] text-white mb-4">
                Support
              </h4>
              <ul className="flex flex-col gap-4 text-white/80">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 pb-2 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] lg:text-[16px] text-white/70 text-center md:text-left">
          <p>© {currentYear} SabiGuy. All rights reserved.</p>
          <div className="flex gap-8 justify-center">
            <a href="#" className="hover:text-white transition-colors">
              Terms & Conditions
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
