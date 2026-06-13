import React from "react";
import PublicHeader from "../../components/PublicHeader";
import { NavLink } from "react-router-dom";

const Section = ({ id, title, children }) => (
  <section id={id} className="py-8 border-b border-gray-200">
    <h2 className="text-4xl font-bold mb-4">{title}</h2>
    <div className="prose max-w-none text-gray-700">{children}</div>
  </section>
);

const PolicyPage = () => {
  const sections = [
    { id: "privacy", title: "Privacy Policy", route: "/policies/privacy" },
    { id: "terms", title: "Terms of Use", route: "/policies/terms" },
    { id: "payment", title: "Payment & Refunds Policy", route: "/policies/payment" },
    { id: "safety", title: "Safety & Trust Policy", route: "/policies/safety" },
    { id: "community", title: "Community Guidelines", route: "/policies/community" },
    { id: "ride-services", title: "Ride Services Policy", route: "/policies/ride-services" },
    { id: "dispatch-delivery", title: "Dispatch & Delivery Policy", route: "/policies/dispatch-delivery" },
    { id: "website", title: "Website Disclaimer", route: "/policies/website" },
    { id: "cookies", title: "Cookie Policy", route: "/policies/cookies" },
  ];

  const handleNavClick = (e, s) => {
    try {
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        const el = document.getElementById(s.id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.replaceState(null, '', `#${s.id}`);
        }
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <PublicHeader />
      <div className="w-[90%] max-w-6xl mx-auto py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-1/4">
            <div className="sticky top-24">
              <nav className="flex flex-col gap-2 text-sm text-gray-700">
                {sections.map((s) => (
                  s.route ? (
                    <NavLink
                      key={s.id}
                      to={s.route}
                      onPointerDown={(e) => handleNavClick(e, s)}
                      onMouseDown={(e) => handleNavClick(e, s)}
                      onTouchStart={(e) => handleNavClick(e, s)}
                      onClick={(e) => handleNavClick(e, s)}
                      className={({ isActive }) =>
                        (isActive ? 'bg-gray-200 ' : '') + 'block py-2 px-3 rounded font-bold text-lg text-black hover:bg-gray-100'
                      }
                    >
                      {s.title}
                    </NavLink>
                  ) : (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="block py-2 px-3 rounded hover:bg-gray-100 font-bold text-black text-lg"
                    >
                      {s.title}
                    </a>
                  )
                ))}
              </nav>
            </div>
          </aside>


          

          <main className="w-full lg:w-3/4 bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <Section id="website" title="WEBSITE DISCLAIMER
">
            <div className="font-bold text-black">
                <h2>Effective Date: 01/06/2026</h2>
            <h2>Last Updated: 01/06/2026</h2>
             </div>

<article>

{/* Website Disclaimer */}
<h2 className="text-2xl font-bold py-4 text-black">Website Disclaimer</h2>

<p>The information, services, and content provided on SabiGuy ("the Platform") are for general informational and service facilitation purposes only.</p>

<p className="py-3">SabiGuy is a technology-enabled marketplace and service coordination platform operated by Pitchers International. We connect users with independent riders, dispatch partners, vendors, businesses, and service providers.</p>

<p className="py-3">While SabiGuy takes reasonable steps to verify providers and maintain platform standards, we do not guarantee:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>The quality, suitability, or performance of services provided by independent providers;</li>
  <li>The accuracy or completeness of information submitted by users or providers;</li>
  <li>Continuous, uninterrupted, or error-free platform availability;</li>
  <li>Specific outcomes resulting from the use of services accessed through the platform.</li>
</ul>

<p className="py-3">Service providers operating through SabiGuy are generally independent contractors and are not employees, agents, or representatives of SabiGuy unless expressly stated otherwise.</p>

<p className="py-3">Users are responsible for exercising reasonable judgment when engaging with providers, requesting services, making purchases, or participating in transactions through the platform.</p>

<p className="py-3">To the fullest extent permitted by applicable law, SabiGuy and Pitchers International shall not be liable for any direct, indirect, incidental, consequential, special, or punitive damages arising from:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Use of the platform;</li>
  <li>Transactions between users and providers;</li>
  <li>Ride or delivery delays;</li>
  <li>Service interruptions;</li>
  <li>Inaccurate listings or information;</li>
  <li>Acts or omissions of independent service providers;</li>
  <li>Events beyond our reasonable control.</li>
</ul>

<p className="py-3">Nothing contained on this website constitutes legal, financial, professional, or other regulated advice.</p>

<p>By accessing or using SabiGuy, you acknowledge and agree to this Disclaimer, our Terms of Use, Privacy Policy, and all related platform policies.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Contact Information */}
<h2 className="text-2xl font-bold py-4 text-black">Contact Information</h2>

<p className="mb-3">For questions regarding this Disclaimer, please contact:</p>

<div className="space-y-3 py-2">
  <p>Pitchers International (Operating SabiGuy)</p>
  <p>Website: sabiguy.com</p>
  <p>Email: info@sabiguy.com</p>
  <p>Location: Ibadan, Oyo State, Nigeria</p>
</div>

<p className="font-bold text-black py-4">End of Website Disclaimer</p>

</article>
     
              </Section>

           
          </main>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
