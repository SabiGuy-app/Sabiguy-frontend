import React from "react";
import { Link } from "react-router-dom";

function DesignFooter() {
  return (
    <footer className="bg-white pb-8 pt-4 text-[#777777]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
        <div className="grid gap-12 pb-12 md:grid-cols-[1.4fr_1fr] lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" aria-label="SabiGuy home"><img src="/logo.jpg" alt="SabiGuy" className="h-auto w-40" /></Link>
            <p className="mt-5 max-w-[240px] text-sm leading-relaxed">Connecting you with trusted<br />local service providers.</p>
            <div className="mt-5 flex gap-4">
              {[
                ["Facebook", "facebook.png", "https://www.facebook.com/profile.php?id=61582188390597"],
                ["Instagram", "instagram.png", "https://www.instagram.com/sabiguyapp/"],
                ["LinkedIn", "linkedin.png", "https://www.linkedin.com/showcase/sabiguy/"],
                ["X", "X.png", "https://x.com/sabiguyapp"],
              ].map(([name, icon, href]) => <a key={name} href={href} aria-label={name} className="opacity-60 transition hover:opacity-100"><img src={`/home/${icon}`} alt="" className="h-5 w-5 object-contain grayscale" /></a>)}
            </div>
          </div>
          {[
            { title: "Company", links: [["About us", "/#landing-benefits-heading"], ["Careers", null], ["Blog", null]] },
            { title: "Services", links: [["Dispatch", "/signup"], ["Errands", "/signup"], ["Beauty & Care", "/signup"]] },
            { title: "Support", links: [["Help Center", "/#faq"], ["Contact", "/#faq"]] },
          ].map((group) => <div key={group.title}><h3 className="mb-5 text-sm font-medium text-[#333333]">{group.title}</h3><ul className="space-y-3 text-sm">{group.links.map(([label, href]) => <li key={label}>{href ? <Link to={href} className="hover:text-[#347B54]">{label}</Link> : <span>{label}</span>}</li>)}</ul></div>)}
        </div>
        <div className="flex flex-col justify-between gap-4 border-t border-[#E6E6E6] pt-5 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} SabiGuy. All rights reserved.</p>
          <div className="flex gap-7"><Link to="/policies/terms" className="hover:text-[#347B54]">Terms &amp; Conditions</Link><Link to="/policies/privacy" className="hover:text-[#347B54]">Privacy Policy</Link></div>
        </div>
        <p className="mt-5 max-w-4xl text-[11px] leading-relaxed text-[#999999]">SabiGuy is a technology enabled marketplace operated by Pitchers International. Services are provided by independent riders and service providers. By using this platform, you agree to our <Link to="/policies" className="underline">policies</Link>.</p>
      </div>
    </footer>
  );
}

const LandingFooter = ({ variant = "default" }) => {
  const currentYear = new Date().getFullYear();

  if (variant === "landing") return <DesignFooter />;

  return (
    <footer className="bg-[#31784D] pt-16 pb-8 border-t border-[#255d3b]">
      <div className="w-[90%] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="flex flex-col gap-6 lg:w-[40%] items-center md:items-start text-center md:text-left">
            <img
              src="/SB%20white.png"
              alt="SabiGuy Logo"
              className="h-14 md:h-16 w-auto"
            />
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
                <img
                  src="/home/X.png"
                  alt="X"
                  className="w-[25px] h-[25px] brightness-0 invert"
                />
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

          <p className="max-w-xl text-white/70 text-center md:text-left">
            SabiGuy is a technology enabled marketplace operated by Pitchers
            International. Services are provided by independent riders and
            service providers. By using this platform, you agree to our{" "}
            <Link
              to="/policies/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white underline"
            >
              Terms of Use
            </Link>
            ,{" "}
            <Link
              to="/policies/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white underline"
            >
              Privacy Policy
            </Link>
            , and{" "}
            <Link
              to="/policies"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white underline"
            >
              related policies
            </Link>
            .
          </p>

          {/* <div className="flex gap-8 justify-center">
            <Link to="/policies" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Policies (Terms & Privacy)
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
