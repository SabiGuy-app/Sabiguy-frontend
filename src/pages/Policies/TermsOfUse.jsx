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
          <Section id="terms" title="Terms of Use">
            <div className="font-bold text-black">
                <h2>Effective Date: 01/06/2026</h2>
            <h2>Last Updated: 01/06/2026</h2>
             </div>
            <article>
      

  {/* Section 1 */}              
        <h2 className="text-2xl font-bold py-4 text-black">1. Introduction</h2>
        <h2 className="text-xl font-bold mb-3 text-black">1.1 About SabiGuy</h2>
        <p className="mb-3">SabiGuy is a technology-enabled marketplace and service coordination platform operated by 
        Pitchers International. We connect individuals, households, businesses, riders, vendors, 
        artisans, professionals, and service providers through a trusted digital ecosystem designed
         to simplify access to everyday services.</p>
         <p>At launch, SabiGuy provides:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Ride Services</li>
        <li>Dispatch & Delivery Services</li>
        </ul>
        <p className="mb-3">As the platform evolves, additional services may be introduced, including home
             services, professional services, domestic services, freelance services, business
              services, and other marketplace categories.</p>
        <p>SabiGuy's mission is to make it easier for people to find trusted service providers,
             move goods efficiently, and access reliable transportation solutions within their 
             communities.</p>

        <h2 className="text-xl font-bold py-2 text-black">1.2 Purpose of These Terms</h2>
        <p className="mb-3">These Terms of Use govern your access to and use of SabiGuy's website, mobile
             applications, products, services, features, and related offerings.</p>
             <p>These Terms are intended to:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Define the rights and responsibilities of users.</li>
        <li>Establish acceptable use of the platform.</li>
        <li>Promote safety, trust, and accountability.</li>
        <li>Protect users, service providers, and the platform.</li>
        <li>Explain how services may be accessed and used.</li>
        </ul>
        <p className="mt-3">By using SabiGuy, you agree to comply with these Terms and all related policies
             published by SabiGuy.</p>

         <h2 className="text-xl font-bold py-2 text-black">1.3 Scope of Application</h2>
         <p>These Terms apply to all users of the SabiGuy platform, including:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Customerss</li>
        <li>Riders</li>
        <li>Dispatch Partners</li>
        <li>Vendors</li>
        <li>Service Providers</li>
        <li>Businesses</li>
        <li>Marketplace Participants</li>
        <li>Website Visitors</li>
        <li>Mobile Application Users</li>
        </ul>
        <p>These Terms govern all interactions conducted through SabiGuy's website, applications,
             communication channels, and future services offered through the platform.</p>

        <hr className="border-t border-gray-300 my-6" />     


{/* Section 2 */}
       <h2 className="text-2xl font-bold py-4 text-black">2. Acceptance of Terms</h2>
        <p className="mb-3">By creating an account, accessing the platform, requesting services, providing services,
             making payments, or otherwise using SabiGuy, you acknowledge that you have read,
              understood, and agreed to be bound by these Terms of Use.</p>
              <p>You also agree to comply with:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Privacy Policy</li>
        <li>Payments & Refund Policy</li>
        <li>Community Guidelines</li>
        <li>Safety & Trust Policy</li>
        <li>Ride Services Policy</li>
        <li>Dispatch & Delivery Policy</li>
        <li>Any additional policies published by SabiGuy</li>
        </ul>
        <p className="mt-3">If you do not agree to these Terms, you must discontinue use of the platform immediately.</p>
            <hr className="border-t border-gray-300 my-6" />

{/* Section 3 */}
        <h2 className="text-2xl font-bold py-4 text-black">3. Eligibility</h2>
        <p>To use SabiGuy, you must:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Be at least eighteen (18) years old.</li>
        <li>Have the legal capacity to enter binding agreements.</li>
        <li>Provide accurate and complete information.</li>
        <li>Comply with applicable laws and regulations.</li>
        </ul>
        <p className="py-3">Businesses and organizations may use the platform through authorized representatives.</p>
        <p>SabiGuy reserves the right to deny, suspend, or terminate access where eligibility requirements are not met.</p>
        <hr className="border-t border-gray-300 my-6" />


{/* Section 4 */}
        <h2 className="text-xl font-bold py-2 text-black">4. Description of Services</h2>
        <p>SabiGuy is a technology platform that facilitates connections between users and independent
             service providers.</p>
             <p>Our services may include:</p>
    <h2 className="text-xl font-bold py-2 text-black">Ride Services</h2>
             <p>Transportation services facilitated through independent riders operating on the platform.</p>
    <h2 className="text-xl font-bold py-2 text-black">Dispatch & Delivery Services</h2>
             <p>Transportation of packages, documents, and approved items through verified dispatch partners.</p>
   <h2 className="text-xl font-bold py-2 text-black">Service Marketplace</h2>
             <p className="mb-3">A marketplace that enables users to discover, compare, and engage trusted
                 service providers across various categories.</p>
            <p>SabiGuy acts primarily as a facilitator and coordination platform and does not
             directly provide most services offered by independent providers on the platform.</p>
<hr className="border-t border-gray-300 my-6" />

      {/* Section 5 */}
      <div>
       <h2 className="text-2xl font-bold py-4 text-black">5. User Accounts</h2>
        <p>Certain platform features require users to create an account.:</p>
        <p>Users agree to:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Provide accurate, current, and complete information.</li>
          <li>Maintain the confidentiality of login credentials.</li>
          <li>Update information when necessary.</li>
          <li>Protect their accounts from unauthorized access.</li>
          <li>Notify SabiGuy immediately of any suspected security breach.</li>
        </ul>
        <p className="py-3">Users are solely responsible for activities conducted through their accounts.</p>
        <p>SabiGuy reserves the right to restrict, suspend, or terminate accounts containing false information or accounts used in violation of platform policies.</p>
      </div>
      <hr className="border-t border-gray-300 my-6" />

      {/* Section 6 */}
      <div>
        <h2 className="text-2xl font-bold py-4 text-black">6. User Responsibilities</h2>
        <p>Users are expected to use SabiGuy responsibly, professionally, and lawfully.</p>
        <p>Users must not:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>IProvide false or misleading information.</li>
          <li>Impersonate another individual or organization.</li>
          <li>Engage in fraudulent or deceptive activities.</li>
          <li>Harass, threaten, intimidate, or abuse other users.</li>
          <li>Upload harmful software, malicious code, or unauthorized content.</li>
          <li>Interfere with platform operations.</li>
          <li>Use the platform for unlawful purposes.</li>
          <li>Violate any applicable laws or regulations.</li>
        </ul>
        <p className="mt-2">Users remain responsible for ensuring that all information provided through the platform is accurate, lawful, and up to date.</p>
      </div>
      <hr className="border-t border-gray-300 my-6" />

      {/* Section 7 */}
     
        <h2 className="text-2xl font-bold py-4 text-black">7. Platform Communications</h2>
        <p>By creating an account or using SabiGuy, users consent to receive communications relating to:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Account activity</li>
          <li>Service requests</li>
          <li>Payment confirmations</li>
          <li>Security notifications</li>
          <li>Platform updates</li>
          <li>Customer support interactions</li>
          <li>Policy updates</li>
          <li>Marketing communications where permitted by law</li>
        </ul>
        <p className="py-3
        ">Users may manage certain communication preferences through their account settings where available.</p>
        <p>Important security, operational, and service-related communications may continue regardless of marketing preferences.</p>
<hr className="border-t border-gray-300 my-6" />


      {/* Section 8 */}  
       <h2 className="text-2xl font-bold py-4 text-black">8. Verification & Identity Requirements</h2>
        <p>To promote trust, safety, and accountability, SabiGuy may require users, riders, vendors, businesses, and service
             providers to complete identity verification procedures.</p>
             <p>Verification requirements may include:</p>

         <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Phone number verification</li>
          <li>Email verification</li>
          <li>Government-issued identification</li>
          <li>Business registration documents</li>
          <li>Address verification</li>
          <li>Profile review and approval</li>
          <li>Additional information deemed necessary by SabiGuy</li>
        </ul>
        <div className="space-y-3">
        <p>Service providers and riders may not be publicly listed or permitted to accept service requests until verification
             requirements have been successfully completed.</p>
        <p>Verification does not constitute a guarantee of competence, reliability, service quality, or future conduct.</p>
        <p>SabiGuy reserves the right to refuse, suspend, or revoke verification status at its discretion.</p>
</div>
<hr className="border-t border-gray-300 my-6" />


 {/* Section 9 */}
    <h2 className="text-2xl font-bold py-4 text-black">9. Platform Transactions & Communications Policy</h2>
       <div className="space-y-3">
        <p>To maintain platform integrity, user safety, service quality, payment security, and dispute resolution
             capabilities, users and service providers agree to conduct transactions through approved SabiGuy channels.</p>
             <p>All payments relating to services discovered, booked, requested, or initiated through SabiGuy
                 must be processed through approved SabiGuy payment channels unless expressly authorized by SabiGuy.</p>
                 <p>Users and service providers must not:</p>

       </div>
         <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Circumvent the platform to avoid fees or commissions.</li>
          <li>Solicit or accept off-platform payments for services initiated through SabiGuy.</li>
          <li>Direct users to unauthorized payment channels.</li>
          <li>Use SabiGuy solely as a lead-generation platform.</li>
          <li>Encourage customers to conduct transactions outside the platform.</li>
          <li>Share contact information for the purpose of bypassing platform fees, verification processes, or payment systems.</li>
        </ul>
        <p className="py-3">Where communication features are available, users are encouraged to communicate through approved SabiGuy channels.</p>
        <p>Maintaining communications on the platform helps:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Improve user safety..</li>
          <li>Facilitate dispute resolution.</li>
          <li>Verify transaction history.</li>
          <li>Investigate complaints.</li>
          <li>Protect users from fraud.</li>
        </ul>
        <p className="mt-3">Violation of this policy may result in warnings, account restrictions, suspension, provider removal, or permanent account termination.</p>

<hr className="border-t border-gray-300 my-6" />


 {/* Section 10 */}
        <h2 className="text-2xl font-bold py-4 text-black">10. Platform Fees</h2>
        <p>SabiGuy may charge fees for services facilitated through the platform.</p>
        <p>Applicable fees may include:</p>

        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Ride service fees</li>
          <li>Dispatch and delivery fees</li>
          <li>Service booking fees</li>
          <li>Platform service charges</li>
          <li>Transaction processing fees</li>
          <li>Premium platform features</li>
          <li>Subscription-based services where applicable</li>
        </ul>
        <p>Applicable fees will be disclosed before transaction completion whenever reasonably possible.</p>
        <p>SabiGuy reserves the right to modify fees, commissions, or service charges at any time.</p>
     
      <hr className="border-t border-gray-300 my-6" />

      {/* Section 11 */}
      
       <h2 className="text-2xl font-bold py-4 text-black">11. Amendments to These Terms</h2>
        <p>SabiGuy reserves the right to update, modify, or replace these Terms of Use at any time.</p>
             <p className="py-3">Changes may occur due to:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Service improvements</li>
          <li>Legal or regulatory requirements</li>
          <li>Security considerations</li>
          <li>Business expansion</li>
          <li>Operational updates</li>  
        </ul>
<div className="space-y-3">
    <p>Updated Terms will be published on the platform together with a revised effective date.</p>
    <p>Continued use of SabiGuy following publication of updated Terms constitutes acceptance of the revised Terms.</p>
    <p>Users who do not agree to updated Terms must discontinue use of the platform.</p>
</div>

 <hr className="border-t border-gray-300 my-6" />

  

     

     

    

      {/* Section 12 */}
      
        <h2 className="text-2xl font-bold py-4 text-black">12. Contact Information</h2>
        <p className="mb-3">For questions, concerns, requests, or complaints relating to privacy or personal data, please contact:</p>
        <div className="space-y-3">
            <p><span className="font-bold">Company:</span> Pitchers International (Operating SabiGuy)</p>
            <p><span className="font-bold">Website:</span> sabiguy.com</p>
            <p><span className="font-bold">Email:</span> info@sabiguy.com</p>
            <p><span className="font-bold">Location:</span> Ibadan, Oyo State, Nigeria</p>
        </div>
        <p className="mt-3">SabiGuy is committed to responding to privacy-related inquiries within a reasonable timeframe and in accordance with applicable laws and regulations.</p>

                <p className="py-3 font-bold text-black">End of Terms of Use</p>
   
      </article>
     
              </Section>

           
          </main>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
