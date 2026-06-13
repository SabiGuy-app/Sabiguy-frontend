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
                        (isActive ? 'bg-gray-200 ' : '') + 'block py-2 px-3 rounded hover:bg-gray-100 font-bold text-black text-lg'
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
          <Section id="safety" title="SAFETY & TRUST POLICY">
            <div className="font-bold text-black">
                <h2>Effective Date: 01/06/2026</h2>
            <h2>Last Updated: 01/06/2026</h2>
             </div>
            <article>
      

  {/* Section 1 */}              
        <h2 className="text-2xl font-bold py-4 text-black">1. Introduction</h2>
        <div className="py-3">
        <p>At SabiGuy, trust and safety are fundamental to our mission of
             connecting people with reliable transportation, delivery, and service providers.</p>
         <p>This Safety & Trust Policy outlines the standards, verification requirements, reporting
             procedures, and enforcement measures that help maintain a safe and trustworthy
              environment for all users, riders, vendors, businesses, and service providers on the platform.</p>
              <p>By using SabiGuy, you agree to comply with this policy.</p>
        </div>

        <hr className="border-t border-gray-300 my-6" />


{/* Section 2 */}
        <h2 className="text-2xl font-bold py-4 text-black"> 2. Provider Verification</h2>
        <h2 className="text-xl font-semibold py-2 text-black">2.1 Verification Requirements</h2>
        <p className="mb-3">All service providers seeking to offer services through SabiGuy must
             complete the applicable verification process before becoming publicly visible or
              eligible to receive customer requests.</p>
             <p>Verification requirements may include:</p>

              <hr className="border-t border-gray-300 my-6" />

    <h2 className="text-xl font-semibold py-2 text-black">2.2 Identity Verification</h2>
    <p className="mb-3">To promote trust and platform security, service providers may be required to submit:</p>

        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Government-issued identification</li>
        <li>Full legal name</li>
        <li>Date of birth</li>
        <li>Profile photograph</li>
        <li>Contact information</li>
        </ul>
        <p className="py-3">Accepted forms of identification may include:</p>

        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>National Identification Number (NIN)</li>
        <li>Driver's License</li>
        <li>International Passport</li>
        <li>Voter's Card</li>
        <li>Other approved identification documents</li>
        </ul>
        <p className="mt-3">SabiGuy reserves the right to reject verification requests
             where submitted information cannot be validated.</p>

<hr className="border-t border-gray-300 my-6" />



         <h2 className="text-xl font-bold py-2 text-black">2.3 Business Verification</h2>
         <p className="mb-3">Businesses and organizations operating through SabiGuy may be required to provide:</p>

        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Business name</li>
        <li>CAC registration information</li>
        <li>Business registration documents</li>
        <li>Business address</li>
        <li>Contact information</li>
        <li>Relevant licenses where applicable</li>
        </ul>
        <p className="mt-3">Business verification helps improve trust and credibility within the marketplace.</p>

        <hr className="border-t border-gray-300 my-6" />     



       <h2 className="text-xl font-bold py-2 text-black">2.4 Rider Verification</h2>
        <p className="mb-3">Individuals providing ride or dispatch services through SabiGuy may be required to provide:</p>

        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Valid government-issued identification</li>
        <li>Phone number verification</li>
        <li>Profile photograph</li>
        <li>Vehicle information</li>
        <li>Rider or driver documentation where applicable</li>
        <li>Additional compliance documents requested by SabiGuy</li>
        </ul>
        <p className="py-3">SabiGuy reserves the right to introduce additional verification requirements as the platform evolves.</p>

       <h2 className="text-xl font-bold py-2 text-black">2.5 Verification Levels</h2>
       <p>SabiGuy may implement multiple verification levels, including:</p>
       <h2 className="text-xl font-bold py-2 text-black">Basic Verification</h2>

         <ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Phone verification</li>
        <li>Email verification</li>
        </ul>
       <h2 className="text-xl font-bold py-2 text-black">Identity Verified</h2>
<ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Government-issued identification verified</li>
        </ul>

        <h2 className="text-xl font-bold py-2 text-black">Business Verified</h2>
<ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Business documentation verified</li>
        </ul>

<h2 className="text-xl font-bold py-2 text-black">Premium Verified</h2>
<ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Additional screening, certifications, documentation, or platform requirements completed</li>
        </ul>
        <p className="mt-3">Verification badges or indicators may be displayed on provider profiles.</p>

            <hr className="border-t border-gray-300 my-6" />

{/* Section 5 */}
        <h2 className="text-xl font-bold py-2 text-black">2.6 Ongoing Compliance</h2>
        <p>Verification is not a one-time process.</p>
        <p className="py-3">Service providers are expected to:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Maintain accurate information</li>
        <li>Update expired documents</li>
        <li>Comply with platform policies</li>
        <li>Maintain professional conduct</li>
        <li>Respond to platform requests for information</li>
        </ul>
        <p className="py-3">Failure to cooperate with verification reviews may
             result in restrictions or suspension.</p>
        <hr className="border-t border-gray-300 my-6" />


{/* Section 3 */}
        <h2 className="text-2xl font-bold py-4 text-black">3. Ratings, Complaints & Accountability</h2>
        <p>Service quality plays an important role in maintaining trust within the SabiGuy ecosystem.</p>
             <p className="py-3">SabiGuy may monitor:</p>
 <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Customer ratings</li>
          <li>Customer complaints</li>
          <li>Service completion records</li>
          <li>Platform conduct</li>
          <li>Policy violations</li>
        </ul>
    <p className="py-3">Providers are expected to maintain acceptable service standards.</p>
     <p>Repeated issues may trigger reviews, restrictions, suspension, or removal from the platform.</p>

   <hr className="border-t border-gray-300 my-6" />

      {/* Section 4 */}
       <h2 className="text-2xl font-bold py-4 text-black">4. User Reporting System</h2>
        <p>Users are encouraged to report safety concerns, misconduct, fraud, scams,
             policy violations, or suspicious activity.</p>
        <h2 className="text-xl font-bold py-2 text-black">4.1 Reporting Users</h2>
        <p>Users may report individuals or businesses who engage in:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Fraudulent activities</li>
          <li>Harassment or abuse</li>
          <li>Impersonation</li>
          <li>Misrepresentation</li>
          <li>Scam attempts</li>
          <li>Policy violations</li>
        </ul>

<hr className="border-t border-gray-300 my-6" />

  <h2 className="text-xl font-bold py-2 text-black">4.2 Reporting Riders</h2>
  <p className="mb-3">Passengers and customers may report riders for:</p>
  <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Unsafe riding behavior</li>
          <li>Reckless driving</li>
          <li>Unprofessional conduct</li>
          <li>Harassment</li>
          <li>Fraudulent activities</li>
          <li>Service misconduct</li>
        </ul>

 <h2 className="text-xl font-bold py-2 text-black">4.3 Reporting Service Providers</h2>
 <p>Customers may report service providers for:</p>
  <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Poor service delivery</li>
          <li>Misrepresentation of qualifications</li>
          <li>Failure to complete agreed services</li>
          <li>Fraudulent practices</li>
          <li>Harassment</li>
          <li>Unprofessional behavior</li>
          <li>Policy violations</li>
        </ul>

      <hr className="border-t border-gray-300 my-6" />


        <h2 className="text-xl font-bold py-2 text-black">4.4 Reporting Fraud & Scams</h2>
        <p>Users are encouraged to report suspected fraud immediately.</p>
        <p>Examples include:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Fake profiles</li>
          <li>Identity theft</li>
          <li>Payment scams</li>
          <li>False service listings</li>
          <li>Unauthorized payment requests</li>
          <li>Attempts to move transactions outside approved platform channels</li>
        </ul>

    
      <hr className="border-t border-gray-300 my-6" />

     
        <h2 className="text-2xl font-bold py-4 text-black">4.5 Emergency & Safety Concerns</h2>
        <p>Where there is an immediate threat to safety, users should first contact
             appropriate emergency services or law enforcement authorities.</p>
             <p className="mt-3">SabiGuy is not an emergency response service.</p>
       
<hr className="border-t border-gray-300 my-6" />


      {/* Section 5 */}  
       <h2 className="text-2xl font-bold py-4 text-black">5. Investigation Process</h2>
        <p>Upon receiving a report, SabiGuy may:</p>

         <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Review account activity</li>
          <li>Review transaction records</li>
          <li>Review communications conducted through approved platform channels</li>
          <li>Request supporting evidence</li>
          <li>Contact involved parties</li>
          <li>Conduct internal investigations</li>
        </ul>

        <p className="mt-3">Failure to cooperate with investigations may result in enforcement action.</p>

<hr className="border-t border-gray-300 my-6" />


 {/* Section 11 */}
    <h2 className="text-2xl font-bold py-4 text-black">6. Platform Actions</h2>
          <p>Following an investigation, SabiGuy may:</p>

         <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Issue warnings</li>
          <li>Remove content</li>
          <li>Restrict platform access</li>
          <li>Suspend accounts</li>
          <li>Revoke verification status</li>
          <li>Remove provider listings</li>
          <li>Permanently terminate accounts</li>
          <li>Refer matters to law enforcement authorities</li>
        </ul>
        <p className="py-3">Actions taken will depend
             on the severity and nature of the violation.</p>

<hr className="border-t border-gray-300 my-6" />


 {/* Section 7 */}
        <h2 className="text-2xl font-bold py-4 text-black">7. Prohibited Activities</h2>
        <p className="mb-3">To maintain a safe platform, certain activities are strictly prohibited.</p>

        <h2 className="text-xl font-bold py-2 text-black">7.1 Illegal Activities</h2>
        <p>Users may not use SabiGuy for activities that violate applicable laws, regulations, or government directives.</p>

                <h2 className="text-xl font-bold py-2 text-black">7.2 Fraud & Scams</h2>
<p>Users must not engage in:</p>

        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Fake service listings</li>
          <li>Fake business profiles</li>
          <li>Payment fraud</li>
          <li>Identity impersonation</li>
          <li>Forged documentation</li>
          <li>Deceptive business practices</li>
        </ul>
     
      <hr className="border-t border-gray-300 my-6" />

      
       <h2 className="text-xl font-bold py-2 text-black">7.3 Platform Circumvention</h2>
             <p className="mb-3">Users and providers may not:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Conduct off-platform transactions for services initiated through SabiGuy</li>
          <li>Avoid platform fees or commissions</li>
          <li>Solicit customers outside approved channels</li>
          <li>Encourage users to bypass platform payment systems</li>  
        </ul>

 <hr className="border-t border-gray-300 my-6" />

  
  <h2 className="text-xl font-bold py-2 text-black">7.4 Dangerous Goods</h2>
  <p className="mb-3">The transportation, sale, or promotion of dangerous
     materials through SabiGuy is prohibited.</p>
     <p>Examples include:</p>
  <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Explosives</li>
          <li>Hazardous chemicals</li>
          <li>Toxic substances</li>
          <li>Flammable materials</li>
          <li>Radioactive materials</li>
        </ul>

 <h2 className="text-xl font-bold py-2 text-black">7.5 Weapons & Restricted Items</h2>
 <p>Users may not transport, sell, distribute, or facilitate transactions involving:</p>
  <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Firearms</li>
          <li>Ammunition</li>
          <li>Explosive devices</li>
          <li>Illegal weapons</li>
          <li>Restricted military equipment</li>
        </ul>

      <hr className="border-t border-gray-300 my-6" />


        <h2 className="text-xl font-bold py-2 text-black">7.6 Drugs & Controlled Substances</h2>
        <p>The platform may not be used to facilitate:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Illegal drugs</li>
          <li>Narcotics</li>
          <li>Controlled substances</li>
          <li>Counterfeit medications</li>
          <li>Unlicensed pharmaceuticals</li>
        </ul>

    
      <hr className="border-t border-gray-300 my-6" />

     
        <h2 className="text-2xl font-bold py-4 text-black">7.7 Counterfeit & Fraudulent Goodss</h2>
        <p>Users may not offer, transport, distribute, or promote:</p>
       
       <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Stolen property</li>
          <li>Counterfeit goods</li>
          <li>Forged documents</li>
          <li>Pirated content</li>
          <li>Unauthorized replicas</li>
        </ul>
<hr className="border-t border-gray-300 my-6" />


       <h2 className="text-xl font-bold py-2 text-black">7.8 Adult Content & Services</h2>
        <p>Users may not use SabiGuy to promote, distribute, or facilitate:</p>

         <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Pornographic content</li>
          <li>Sexual services</li>
          <li>Exploitative content</li>
          <li>Obscene materials prohibited by law</li>
        </ul>

        <p className="mt-3">Failure to cooperate with investigations may result in enforcement action.</p>

<hr className="border-t border-gray-300 my-6" />


    <h2 className="text-xl font-bold py-2 text-black">7.9 Hate Speech, Harassment & Abuse</h2>
          <p>The platform must not be used to:</p>

         <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Promote violence</li>
          <li>Harass users</li>
          <li>Threaten individuals</li>
          <li>Bully others</li>
          <li>Discriminate against individuals or groups</li>
        </ul>

<hr className="border-t border-gray-300 my-6" />


   <h2 className="text-xl font-bold py-2 text-black">7.10 Misuse of Platform Services</h2>
        <p>Users must not:</p>
       
       <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Create fraudulent accounts</li>
          <li>Manipulate ratings or reviews</li>
          <li>Abuse promotions</li>
          <li>Submit false complaints</li>
          <li>Attempt unauthorized access</li>
          <li>Interfere with platform operations</li>
        </ul>
<hr className="border-t border-gray-300 my-6" />


{/* section 8 */}
       <h2 className="text-2xl font-bold py-4 text-black">8. Enforcement & Compliance</h2>
        <p>SabiGuy reserves the right to:</p>

         <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Remove listings</li>
          <li>Cancel transactions</li>
          <li>Restrict account access</li>
          <li>Suspend users or providers</li>
          <li>Revoke verification status</li>
          <li>Withhold payouts where appropriate</li>
          <li>Report unlawful activity to authorities</li>
        </ul>

        <p className="mt-3">Enforcement decisions may be made without prior notice
             where necessary to protect users, the platform, or public safety.</p>

<hr className="border-t border-gray-300 my-6" />


    <h2 className="text-2xl font-bold py-4 text-black">9. Trust & Safety Commitment</h2>
          <p>SabiGuy is committed to building a marketplace where users can
             confidently discover trusted service providers, request rides, send
              deliveries, and access everyday services.</p>

              <p className="py-3">Through verification systems, accountability measures,
                 customer feedback, platform monitoring, and community participation,
                  SabiGuy aims to promote:</p>

         <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Transparency</li>
          <li>Reliability</li>
          <li>Professionalism</li>
          <li>Safety</li>
          <li>Accountability</li>
          <li>Community trust</li>
        </ul>
        <p className="mt-3">These principles guide the continued development of the SabiGuy ecosystem
             and its commitment to serving individuals, households, businesses,
              and communities.</p>
        
<hr className="border-t border-gray-300 my-6" />









 {/* Section 10 */}
      
        <h2 className="text-2xl font-bold py-4 text-black">10. Contact Information</h2>
        <p className="mb-3">For safety concerns, fraud reports, verification issues, policy violations, or trust-related inquiries, please contact:</p>
        <div className="space-y-3">
            <p><span className="font-bold">Company:</span> Pitchers International (Operating SabiGuy)</p>
            <p><span className="font-bold">Website:</span> sabiguy.com</p>
            <p><span className="font-bold">Email:</span> info@sabiguy.com</p>
            <p><span className="font-bold">Location:</span> Ibadan, Oyo State, Nigeria</p>
        </div>
        <p className="mt-3">SabiGuy is committed to responding to privacy-related inquiries within a reasonable timeframe and in accordance with applicable laws and regulations.</p>

        <p className="py-3 font-bold text-black">End of Safety & Trust Policy</p>
   
      </article>
     
              </Section>

           
          </main>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
