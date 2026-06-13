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
          <Section id="payment" title="PAYMENTS & REFUND POLICY">
            <div className="font-bold text-black">
                <h2>Effective Date: 01/06/2026</h2>
            <h2>Last Updated: 01/06/2026</h2>
             </div>
            <article>
      

  {/* Section 1 */}              
        <h2 className="text-2xl font-bold py-4 text-black">1. Platform Fees</h2>
        <p className="mb-3">SabiGuy may charge fees for services facilitated through the platform.</p>
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
        <p className="py-3">All applicable fees will be disclosed before transaction completion
             whenever reasonably possible.</p>
        <p>SabiGuy reserves the right to modify fees, commissions, or service charges at any time.</p>

        <hr className="border-t border-gray-300 my-6" />


{/* Section 2 */}
        <h2 className="text-2xl font-bold py-4 text-black"> 2. Approved Payment Channels</h2>
        <p className="mb-3">To maintain platform integrity, user protection, provider
             accountability, and dispute resolution capabilities, all payments
              relating to services discovered, booked, requested, or initiated
               through SabiGuy must be processed through approved SabiGuy
                payment channels unless expressly authorized by SabiGuy.</p>
             <p>Users and service providers agree not to:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Circumvent the platform to avoid fees or commissions.</li>
        <li>Request or accept payments outside approved SabiGuy channels.</li>
        <li>Direct users to make payments through unauthorized channels.</li>
        <li>Use SabiGuy solely as a lead-generation platform.</li>
        <li>Encourage off-platform transactions for services initiated through SabiGuy.</li>
        </ul>
        <p className="mt-3">Violation of this policy may result in:</p>

        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Warning notices</li>
        <li>Transaction restrictions</li>
        <li>Account suspension</li>
        <li>Removal from the platform</li>
        <li>Permanent account termination</li>
        </ul>
        <p className="mt-3">SabiGuy reserves the right to investigate suspected platform circumvention activities.</p>

<hr className="border-t border-gray-300 my-6" />


{/* Section 3 */}
         <h2 className="text-2xl font-bold py-4 text-black">3. Platform Communications</h2>
         <p>Where communication features are available, users and providers are
             encouraged to communicate through approved SabiGuy channels.</p>
             <p className="py-3">Maintaining communications on the platform helps:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Improve user safety</li>
        <li>Facilitate dispute resolution</li>
        <li>Verify transaction history</li>
        <li>Investigate complaints</li>
        <li>Protect users from fraud</li>
        </ul>
        <p className="mt-3">SabiGuy may not be able to investigate disputes arising from communications
             conducted entirely outside approved platform channels.</p>

        <hr className="border-t border-gray-300 my-6" />     


{/* Section 4 */}
       <h2 className="text-2xl font-bold py-4 text-black">4. Service Charges</h2>
        <p className="mb-3">The total amount payable for a service may include:</p>
              <p>You also agree to comply with:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Base service charges</li>
        <li>Distance-based fees</li>
        <li>Time-based fees</li>
        <li>Platform fees</li>
        <li>Convenience fees</li>
        <li>Taxes or regulatory charges where applicable</li>
        </ul>
        <p className="py-3">Pricing may vary depending on:</p>

         <ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Service category</li>
        <li>Service location</li>
        <li>Provider availability</li>
        <li>Operational demand</li>
        <li>Other relevant factors</li>
        </ul>
        <p className="mt-3">Users are responsible for reviewing pricing information before confirming transactions.</p>
            <hr className="border-t border-gray-300 my-6" />

{/* Section 5 */}
        <h2 className="text-2xl font-bold py-4 text-black">5. Payment Processing</h2>
        <p>Payments may be processed through payment providers approved by SabiGuy.</p>
        <p className="py-3">Accepted payment methods may include:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
        <li>Debit cards</li>
        <li>Bank transfers</li>
        <li>Mobile payment solutions</li>
        <li>Digital wallets</li>
        <li>Other approved payment methods</li>
        </ul>
        <p className="py-3">By initiating a transaction, users authorize SabiGuy and its payment partners to process applicable payments.</p>
        <p>SabiGuy may engage third-party payment processors and does not store sensitive payment credentials beyond what is necessary for transaction processing and compliance.</p>
        <hr className="border-t border-gray-300 my-6" />


{/* Section 6 */}
        <h2 className="text-2xl font-bold py-4 text-black">6. Payment Security</h2>
        <p>SabiGuy takes reasonable measures to protect payment-related information.</p>
             <p className="py-3">Security measures may include:</p>
 <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Encrypted transactions</li>
          <li>Secure payment gateways</li>
          <li>Update information when necessary.</li>
          <li>Fraud detection systems</li>
          <li>Transaction monitoring</li>
          <li>Access controls</li>
        </ul>
    <p className="py-3">While reasonable safeguards are implemented, no electronic payment
             system can guarantee absolute security.</p>
     <p>Users are responsible for protecting their account
        credentials and reporting suspicious activity promptly.</p>

   <hr className="border-t border-gray-300 my-6" />

      {/* Section 7 */}
       <h2 className="text-2xl font-bold py-4 text-black">7. Refund Eligibility</h2>
        <p>Refund requests may be considered under circumstances including:</p>
        <h2 className="text-xl font-bold py-2 text-black">Ride Services</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Duplicate payments</li>
          <li>Incorrect charges</li>
          <li>Services not provided</li>
          <li>Platform errors</li>
        </ul>
  <h2 className="text-xl font-bold py-2 text-black">Dispatch & Delivery Services</h2>
  <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Services not fulfilled</li>
          <li>Incorrect billing</li>
          <li>Platform processing errors</li>
        </ul>

 <h2 className="text-xl font-bold py-2 text-black">Marketplace Services</h2>
  <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Services materially different from agreed descriptions</li>
          <li>Verified provider misconduct</li>
          <li>Platform-related billing errors</li>
        </ul>

        <p className="mt-3">Refund eligibility shall be determined based on available evidence and platform policies.</p>

      <hr className="border-t border-gray-300 my-6" />

      {/* Section 8 */}
        <h2 className="text-2xl font-bold py-4 text-black">8. Refund Review Process</h2>
        <p>Where a refund request is submitted, SabiGuy may:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Review transaction records</li>
          <li>Review service records</li>
          <li>Request supporting evidence</li>
          <li>Contact involved parties</li>
          <li>Conduct internal investigations</li>
        </ul>

        <p className="py-3">Users may be required to provide:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Receipts</li>
          <li>Screenshots</li>
          <li>Communication records</li>
          <li>Service details</li>
          <li>Additional supporting documentation</li>
        </ul>
        <p className="mt-3">Refund reviews may take a reasonable period depending on the complexity of the matter.</p>
    
      <hr className="border-t border-gray-300 my-6" />

      {/* Section 9 */}
     
        <h2 className="text-2xl font-bold py-4 text-black">9. Non-Refundable Transactions</h2>
        <p>Refunds may not be granted where:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Services were successfully delivered as agreed</li>
          <li>Users change their minds after service completion</li>
          <li>Delays occurred due to circumstances beyond reasonable control</li>
          <li>Claims cannot be reasonably substantiated</li>
          <li>Platform policies were violated by the requesting party</li>
        </ul>
        <p className="py-3">SabiGuy reserves the right to determine refund eligibility based on available information.</p>
<hr className="border-t border-gray-300 my-6" />


      {/* Section 10 */}  
       <h2 className="text-2xl font-bold py-4 text-black">10. Chargebacks & Payment Disputes</h2>
        <p>Users are encouraged to contact SabiGuy before initiating payment disputes with financial institutions.</p>
             <p>Where a chargeback or payment dispute occurs, SabiGuy may:</p>

         <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Investigate the transaction</li>
          <li>Request supporting evidence</li>
          <li>Restrict account activity</li>
          <li>Suspend accounts where fraud is suspected</li>
        </ul>

        <p className="mt-3">Fraudulent chargebacks may result in account suspension, account termination, financial recovery
             actions, or legal proceedings where appropriate.</p>

<hr className="border-t border-gray-300 my-6" />


 {/* Section 11 */}
    <h2 className="text-2xl font-bold py-4 text-black">11. Provider Payouts</h2>
       <div className="space-y-3">
        <p>Where applicable, SabiGuy may facilitate payments to riders, vendors, and service providers.</p>
          <p>Provider payouts may be subject to:</p>
       </div>

         <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Platform commissions</li>
          <li>Service fees</li>
          <li>Verification requirements</li>
          <li>Fraud prevention reviews</li>
          <li>Applicable taxes or deductions</li>
        </ul>
        <p className="py-3">SabiGuy reserves the right to delay, adjust, or withhold payouts where
             fraud, disputes, policy violations, or compliance concerns are under investigation.</p>

<hr className="border-t border-gray-300 my-6" />


 {/* Section 12 */}
        <h2 className="text-2xl font-bold py-4 text-black">12. Financial Integrity & Compliance</h2>
        <p className="mb-3">To maintain a secure and trustworthy ecosystem, SabiGuy may monitor transactions for:</p>

        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>Fraudulent activity</li>
          <li>Money laundering risks</li>
          <li>Suspicious behavior</li>
          <li>Platform abuse</li>
          <li>Regulatory compliance</li>
        </ul>
        <p className="mt-3">SabiGuy reserves the right to suspend transactions, restrict accounts, withhold payouts, or
             cooperate with regulatory and law enforcement authorities where required by law.</p>
     
      <hr className="border-t border-gray-300 my-6" />

      {/* Section 13 */}
      
       <h2 className="text-2xl font-bold py-4 text-black">13. Policy Updates</h2>
             <p className="mb-3">SabiGuy may update this Payments & Refund Policy periodically to reflect:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 px-7">
          <li>New services</li>
          <li>Regulatory requirements</li>
          <li>Platform improvements</li>
          <li>Payment processing changes</li>  
        </ul>

    <p className="py-3">Updated versions will be published on the platform with a revised effective date.</p>
    <p>Continued use of the platform constitutes acceptance of any updated payment policies.</p>


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

        <p className="py-3 font-bold text-black">End of Payments & Refund Policy</p>
   
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
