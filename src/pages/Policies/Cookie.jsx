import React from "react";
import PublicHeader from "../../components/PublicHeader";
import { NavLink } from "react-router-dom";
import LandingFooter from "../../components/LandingFooter";

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
          <Section id="cookies" title="COOKIE POLICY">
            <div className="font-bold text-black">
                <h2>Effective Date: 01/06/2026</h2>
            <h2>Last Updated: 01/06/2026</h2>
             </div>

<article>

{/* Section 1 */}
<h2 className="text-2xl font-bold py-4 text-black">1. Introduction</h2>

<p>This Cookie Policy explains how SabiGuy ("we," "our," or "us"), operated by Pitchers International, uses cookies and similar technologies on our website, mobile applications, and related services.</p>

<p className="py-3">By using SabiGuy, you consent to the use of cookies and similar technologies as described in this policy, except where prohibited by law.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 2 */}
<h2 className="text-2xl font-bold py-4 text-black">2. What Are Cookies?</h2>

<p>Cookies are small text files stored on your device when you visit a website or use certain online services.</p>

<p className="py-3">Cookies help websites and applications:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Remember user preferences</li>
  <li>Improve functionality</li>
  <li>Enhance security</li>
  <li>Analyze performance</li>
  <li>Personalize user experiences</li>
</ul>

<p className="mt-3">Cookies may be temporary (session cookies) or remain on your device for a specified period (persistent cookies).</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 3 */}
<h2 className="text-2xl font-bold py-4 text-black">3. Types of Cookies We Use</h2>

<h2 className="text-xl font-bold py-2 text-black">3.1 Essential Cookies</h2>

<p>These cookies are necessary for the operation of the platform and cannot be disabled through our systems.</p>

<p className="py-3">They help us:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Authenticate users</li>
  <li>Maintain secure sessions</li>
  <li>Protect against fraudulent activity</li>
  <li>Enable core platform functionality</li>
</ul>

<p className="mt-3">Without these cookies, certain services may not function properly.</p>

<h2 className="text-xl font-bold py-2 text-black">3.2 Performance & Analytics Cookies</h2>

<p>These cookies help us understand how users interact with SabiGuy.</p>

<p className="py-3">They may collect information such as:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Pages visited</li>
  <li>Time spent on pages</li>
  <li>User interactions</li>
  <li>Error reports</li>
  <li>Platform performance metrics</li>
</ul>

<p className="mt-3">This information helps us improve platform functionality and user experience.</p>

<h2 className="text-xl font-bold py-2 text-black">3.3 Functional Cookies</h2>

<p>Functional cookies allow the platform to remember user preferences and settings.</p>

<p className="py-3">Examples include:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Language preferences</li>
  <li>Login preferences</li>
  <li>User settings</li>
  <li>Service preferences</li>
</ul>

<p className="mt-3">These cookies help provide a more personalized experience.</p>

<h2 className="text-xl font-bold py-2 text-black">3.4 Security Cookies</h2>

<p>Security cookies help us:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Detect suspicious activity</li>
  <li>Prevent unauthorized access</li>
  <li>Protect user accounts</li>
  <li>Maintain platform integrity</li>
</ul>

<p className="mt-3">These cookies are important for protecting both users and the platform.</p>

<h2 className="text-xl font-bold py-2 text-black">3.5 Advertising & Marketing Cookies</h2>

<p>Where applicable, SabiGuy may use cookies to:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Measure marketing effectiveness</li>
  <li>Deliver relevant promotions</li>
  <li>Analyze advertising performance</li>
  <li>Improve customer acquisition efforts</li>
</ul>

<p className="py-3">These cookies may be placed by SabiGuy or approved third-party partners.</p>

<p>Users may have the option to manage marketing cookie preferences where legally required.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 4 */}
<h2 className="text-2xl font-bold py-4 text-black">4. Third-Party Cookies</h2>

<p>Some cookies may be provided by third-party services integrated with SabiGuy.</p>

<p className="py-3">Examples may include:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Analytics providers</li>
  <li>Payment processors</li>
  <li>Customer support tools</li>
  <li>Marketing platforms</li>
  <li>Social media integrations</li>
</ul>

<p className="py-3">These third parties operate under their own privacy and cookie policies.</p>

<p>SabiGuy does not control third-party cookie practices.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 5 */}
<h2 className="text-2xl font-bold py-4 text-black">5. How We Use Cookie Data</h2>

<p>Information collected through cookies may be used to:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Improve website functionality</li>
  <li>Maintain security</li>
  <li>Analyze platform usage</li>
  <li>Personalize experiences</li>
  <li>Prevent fraud</li>
  <li>Diagnose technical issues</li>
  <li>Improve service performance</li>
  <li>Support business operations</li>
</ul>

<p className="mt-3">Cookie information is processed in accordance with our Privacy Policy.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 6 */}
<h2 className="text-2xl font-bold py-4 text-black">6. Managing Cookies</h2>

<p>Most web browsers allow users to:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Accept cookies</li>
  <li>Reject cookies</li>
  <li>Delete existing cookies</li>
  <li>Configure cookie preferences</li>
</ul>

<p className="py-3">Users can usually manage cookies through browser settings.</p>

<p className="py-3">Please note that disabling certain cookies may:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Affect website functionality</li>
  <li>Prevent access to certain features</li>
  <li>Reduce platform performance</li>
  <li>Impact user experience</li>
</ul>

<hr className="border-t border-gray-300 my-6" />

{/* Section 7 */}
<h2 className="text-2xl font-bold py-4 text-black">7. Mobile Technologies</h2>

<p>Mobile applications may use technologies similar to cookies, including:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Device identifiers</li>
  <li>Local storage</li>
  <li>Analytics technologies</li>
  <li>Security monitoring tools</li>
</ul>

<p className="mt-3">These technologies help us provide and improve mobile services.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 8 */}
<h2 className="text-2xl font-bold py-4 text-black">8. Data Protection & Privacy</h2>

<p>Any personal information collected through cookies or similar technologies is handled in accordance with:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Our Privacy Policy</li>
  <li>Applicable Nigerian data protection laws</li>
  <li>The Nigeria Data Protection Act (NDPA)</li>
</ul>

<p className="py-3">We do not sell personal information collected through cookies.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 9 */}
<h2 className="text-2xl font-bold py-4 text-black">9. Changes to This Cookie Policy</h2>

<p>SabiGuy may update this Cookie Policy periodically to reflect:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Regulatory requirements</li>
  <li>Technology changes</li>
  <li>Platform improvements</li>
  <li>Business developments</li>
</ul>

<p className="py-3">Updated versions will be published with a revised effective date.</p>

<p>Continued use of the platform constitutes acceptance of the updated Cookie Policy.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 10 */}
<h2 className="text-2xl font-bold py-4 text-black">10. Contact Information</h2>

<p className="mb-3">If you have questions about this Cookie Policy or how cookies are used on SabiGuy, please contact:</p>

<div className="space-y-3 py-2">
  <p>Pitchers International (Operating SabiGuy)</p>
  <p>Website: sabiguy.com</p>
  <p>Email: info@sabiguy.com</p>
  <p>Location: Ibadan, Oyo State, Nigeria</p>
</div>

<p className="font-bold text-black py-4">End of Cookie Policy</p>

</article>
     
              </Section>

           
          </main>
        </div>
      </div>
      <LandingFooter />
    </div>
  );
};

export default PolicyPage;
