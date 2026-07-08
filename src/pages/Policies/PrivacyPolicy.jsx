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
       <div className="bg-white overflow-x-hidden w-full relative pt-16 md:pt-20">
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
          <Section id="privacy" title="Privacy Policy">
            <div className="font-bold text-black">
                <h2>Effective Date: 01/06/2026</h2>
            <h2>Last Updated: 01/06/2026</h2>
             </div>
            <article>
            <div>
        <h2 className="text-2xl font-bold py-4 text-black">1. Information We Collect</h2>
        <p>To provide and improve our services, SabiGuy may collect the following categories of information:</p>
        <h2 className="text-xl font-bold py-2 text-black">Personal Information</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Full name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Date of birth</li>
        <li>Profile photograph</li>
        <li>Residential or business address</li>
        <li>Government-issued ID</li>
        </ul>

        <h2 className="text-xl font-bold py-2 text-black">Account Information</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Username</li>
        <li>Login credentials</li>
        <li>Account preferences</li>
        <li>Communication settings</li>
        </ul>

         <h2 className="text-xl font-bold py-2 text-black">Service Information</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Ride requests</li>
        <li>Delivery requests</li>
        <li>Provider interactions</li>
        <li>Ratings and reviews</li>
        <li>Transaction history</li>
        </ul>

        <h2 className="text-xl font-bold py-2 text-black">Location Information</h2>
        <p>Where permitted by your device settings, SabiGuy may collect location data to:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Match users with nearby providers</li>
        <li>Facilitate rides and deliveries</li>
        <li>Improve service efficiency</li>
        <li>Enhance platform safety</li>
        </ul>

        <h2 className="text-xl font-bold py-2 text-black">Device and Technical Information</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 px-8">
        <li>IP address</li>
        <li>IP address</li>
        <li>Browser type</li>
        <li>Device type</li>
        <li>Operating system</li>
        <li>Device identifiers</li>
        <li>App usage statistics</li>
        <li>Error reports and diagnostics</li>
        </ul>

        <h2 className="text-xl font-bold py-2 text-black">Payment Information</h2>
        <p>Payments processed through the platform may require:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Transaction references</li>
        <li>Payment confirmations</li>
        <li>Billing information</li>
        </ul>
        <p className="mt-3">SabiGuy does not store full payment card details unless expressly stated and secured in accordance with applicable regulations.</p>
      </div>
<hr className="border-t border-gray-300 my-6" />


      {/* Section 2 */}
      <div>
       <h2 className="text-2xl font-bold py-4 text-black">2. How We Use Your Information</h2>
        <p>We use information collected through SabiGuy to:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Create and manage user accounts</li>
          <li>Verify user identities</li>
          <li>Facilitate rides, dispatch requests, and service bookings</li>
          <li>Process payments and platform fees</li>
          <li>Improve platform functionality and performance</li>
          <li>Provide customer support</li>
          <li>Prevent fraud and abuse</li>
          <li>Enhance platform security</li>
          <li>Communicate important updates and notifications</li>
          <li>Personalize user experiences</li>
          <li>Analyze platform usage and trends</li>
          <li>Comply with legal and regulatory obligations</li>
        </ul>
        <p className="mt-3">Information is processed only where necessary for legitimate business purposes, user consent, legal compliance, or contractual obligations.</p>
      </div>
      <hr className="border-t border-gray-300 my-6" />

      {/* Section 3 */}
      <div>
        <h2 className="text-2xl font-bold py-4 text-black">3. Data Usage Transparency</h2>
        <p>We use information collected through SabiGuy to:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Improve products and services</li>
          <li>Develop new features</li>
          <li>Measure performance</li>
          <li>Conduct analytics</li>
          <li>Monitor safety</li>
          <li>Detect fraud</li>
          <li>Support decision-making</li>
        </ul>
        <p className="mt-2">We do not sell personal information to third parties.</p>
        <p className="mt-2">Where third-party service providers assist in operating the platform, access to user information is limited to the extent necessary for providing those services.</p>
      </div>
      <hr className="border-t border-gray-300 my-6" />

      {/* Section 4 */}
      <div>
        <h2 className="text-2xl font-bold py-4 text-black">4. Sharing of Information</h2>
        <p>SabiGuy may share information under the following circumstances.</p>

        <h2 className="text-xl font-bold py-2 text-black">With Other Users</h2>
        <p>Certain information may be visible to facilitate service delivery, including:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>First name</li>
          <li>Profile photograph</li>
          <li>Ratings and reviews</li>
          <li>Service provider profiles</li>
          <li>Contact information necessary for service fulfillment</li>
        </ul>

        <h2 className="text-xl font-bold py-2 text-black">With Service Providers</h2>
        <p>Information may be shared with riders, dispatch partners, vendors, or service providers when necessary to fulfill a requested service.</p>

        <h2 className="text-xl font-bold py-2 text-black">With Third-Party Service Providers</h2>
        <p>We may engage trusted providers for:</p>
         <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Cloud hosting</li>
          <li>Analytics</li>
          <li>Customer support</li>
          <li>Payment processing</li>
          <li>Messaging services</li>
          <li>Security monitoring</li>
        </ul>

        <h2 className="text-xl font-bold py-2 text-black">Legal and Regulatory Compliance</h2>
        <p>Information may be disclosed when required by:</p>
         <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Applicable laws</li>
          <li>Court orders</li>
          <li>Government agencies</li>
          <li>Law enforcement authorities</li>
        </ul>

        <h2 className="text-xl font-bold py-2 text-black">Business Transactions</h2>
        <p>In the event of a merger, acquisition, restructuring, or sale of assets, user information may be transferred as part of the transaction.</p>
      </div>
      <hr className="border-t border-gray-300 my-6" />

      {/* Section 5 */}
      <div>
       <h2 className="text-2xl font-bold py-4 text-black">5. Data Security & Retention</h2>
        <p>SabiGuy implements reasonable technical, administrative, and organizational measures designed
             to protect user information from unauthorized access, disclosure, alteration, or destruction.</p>
             <p className="py-3">Security measures may include:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Encrypted data transmission</li>
          <li>Access controls</li>
          <li>Secure cloud infrastructure</li>
          <li>Authentication systems</li>
          <li>Monitoring and fraud detection tools</li>  
        </ul>
      <p className="mt-3">User information is retained only for as long as necessary to: </p>

      <ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Provide services</li>
            <li>Meet legal obligations</li>
            <li>Resolve disputes</li>
            <li>Prevent fraud</li>
            <li>Enforce platform policies</li>
            </ul>
        <p className="mt-2">When information is no longer required, it may be securely deleted, anonymized, or archived as permitted by law.</p>
      </div>
      <hr className="border-t border-gray-300 my-6" />

      {/* Section 6 */}
      <div>
       <h2 className="text-2xl font-bold py-4 text-black">6. Nigeria Data Protection Compliance (NDPA)</h2>
        <p>SabiGuy is committed to complying with applicable Nigerian data protection laws, 
            including the Nigeria Data Protection Act (NDPA).</p>
             <p className="py-3">Subject to applicable legal limitations, users may have the right to:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Access their personal information</li>
          <li>Request deletion of personal information</li>
          <li>Withdraw consent where applicable</li>
          <li>Object to certain forms of processing</li>
          <li>Request data portability where legally applicable</li>  
        </ul>
        <p className="mt-3">Requests relating to personal information may be submitted using the contact information provided in this policy.</p>
      </div>
      <hr className="border-t border-gray-300 my-6" />

      {/* Section 7 */}
      <div>
        <h2 className="text-2xl font-bold py-4 text-black">7. Cookies & Tracking Technologies</h2>
        <p>SabiGuy may use cookies, pixels, and similar technologies to:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Maintain user sessions</li>
          <li>Remember preferences</li>
          <li>Improve platform performance</li>
          <li>Analyze user behavior</li>
          <li>Enhance security</li>
          <li>Measure marketing effectiveness</li>
        </ul>
        <p className="mt-3">Users may manage cookie preferences through their browser settings. However, disabling certain cookies may affect platform functionality.</p>
      </div>
      <hr className="border-t border-gray-300 my-6" />

      {/* Section 8 */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold py-4 text-black">8. Cookies & Tracking Technologies</h2>
        <p>The platform may integrate with or contain links to third-party services, websites, applications, or payment providers.</p>
        <p>These third parties operate independently and maintain their own privacy practices. SabiGuy is not responsible for the privacy practices, policies, or content of third-party services.</p>
        <p>Users are encouraged to review applicable third-party privacy policies before engaging with such services.</p>
      </div>
      <hr className="border-t border-gray-300 my-6" />

      {/* Section 9 */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold py-4 text-black">9. Children's Privacy</h2>
        <p>SabiGuy is intended for individuals who are at least eighteen (18) years old.</p>
        <p>We do not knowingly collect personal information from children under the age of 18.</p>
        <p>If we become aware that information has been collected from a child without appropriate authorization, we may take reasonable steps to delete such information.</p>
        <p>Parents or guardians who believe a child has provided information to SabiGuy may contact us for assistance.</p>
      </div>
      <hr className="border-t border-gray-300 my-6" />

      {/* Section 10 */}
      <div>
        <h2 className="text-2xl font-bold py-4 text-black">10. Changes to This Privacy Policy</h2>
        <p>SabiGuy reserves the right to update, modify, or revise this Privacy Policy at any time.</p>
        <p className="mt-3">Changes may be made to:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Reflect new services or features</li>
          <li>Address legal or regulatory requirements</li>
          <li>Improve transparency</li>
          <li>Enhance data protection practices</li>
        </ul>
        <p className="py-3">Updated versions will be published on the platform with a revised effective date.</p>
        <p>Continued use of SabiGuy after such changes constitutes acceptance of the revised Privacy Policy.</p>
      </div>
      <hr className="border-t border-gray-300 my-6" />

      {/* Section 11 */}
        <h2 className="text-2xl font-bold py-4 text-black">11. Contact Information</h2>
        <p className="mb-3">For questions, concerns, requests, or complaints relating to privacy or personal data, please contact:</p>
        <div className="space-y-3">
            <p><span className="font-bold">Company:</span> Pitchers International (Operating SabiGuy)</p>
            <p><span className="font-bold">Website:</span> sabiguy.com</p>
            <p><span className="font-bold">Email:</span> info@sabiguy.com</p>
            <p><span className="font-bold">Location:</span> Ibadan, Oyo State, Nigeria</p>
        </div>
        <p className="mt-3">SabiGuy is committed to responding to privacy-related inquiries within a reasonable timeframe and in
           accordance with applicable laws and regulations.</p>
                   <p className="py-3 font-bold text-black">End of Privacy Policy</p>
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
