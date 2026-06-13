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
          <Section id="dispatch-delivery" title="DISPATCH & DELIVERY POLICY">
            <div className="font-bold text-black">
                <h2>Effective Date: 01/06/2026</h2>
            <h2>Last Updated: 01/06/2026</h2>
             </div>
            

<article>

{/* Section 1 */}
<h2 className="text-2xl font-bold py-4 text-black">1. Introduction</h2>

<p>This Dispatch & Delivery Policy governs the use of dispatch, courier, and delivery services facilitated through the SabiGuy platform.</p>

<p className="py-3">SabiGuy connects customers with independent riders and delivery partners to transport packages, documents, and approved items in a safe, efficient, and reliable manner.</p>

<p>By requesting, accepting, providing, or participating in dispatch and delivery services through SabiGuy, users agree to comply with this policy.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 2 */}
<h2 className="text-2xl font-bold py-4 text-black">2. Nature of Dispatch Services</h2>

<p>SabiGuy is a technology platform that facilitates delivery requests between customers and independent dispatch partners.</p>

<p className="py-3">Unless expressly stated otherwise:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Dispatch riders are independent service providers.</li>
  <li>SabiGuy does not own all vehicles used for deliveries.</li>
  <li>SabiGuy does not employ all delivery riders.</li>
  <li>SabiGuy facilitates delivery coordination, communication, payment processing, and service management.</li>
</ul>

<p className="mt-3">Delivery services are subject to availability, operational conditions, weather conditions, and platform requirements.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 3 */}
<h2 className="text-2xl font-bold py-4 text-black">3. Dispatch Requests</h2>

<p>Customers may request dispatch services through approved SabiGuy channels.</p>

<p className="py-3">When submitting a delivery request, customers agree to provide:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Accurate pickup information</li>
  <li>Accurate delivery information</li>
  <li>Correct recipient information</li>
  <li>Accurate item descriptions</li>
  <li>Special handling instructions where applicable</li>
</ul>

<p className="mt-3">Providing inaccurate information may result in delays, failed deliveries, additional charges, or service cancellation.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 4 */}
<h2 className="text-2xl font-bold py-4 text-black">4. Sender Responsibilities</h2>

<p>The sender is responsible for:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Providing accurate package details</li>
  <li>Packaging items appropriately</li>
  <li>Ensuring items are lawful and permitted</li>
  <li>Providing accurate pickup and delivery information</li>
  <li>Ensuring the recipient is available where necessary</li>
</ul>

<p className="py-3">Senders must not:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Misrepresent package contents</li>
  <li>Submit prohibited items</li>
  <li>Use false addresses</li>
  <li>Engage in fraudulent activities</li>
</ul>

<p className="mt-3">The sender remains responsible for losses resulting from inaccurate information provided during booking.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 5 */}
<h2 className="text-2xl font-bold py-4 text-black">5. Recipient Responsibilities</h2>

<p>Recipients are expected to:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Be available to receive deliveries where applicable</li>
  <li>Provide accurate contact information</li>
  <li>Verify deliveries before acceptance</li>
  <li>Cooperate with delivery arrangements</li>
</ul>

<p className="py-3">Failure of a recipient to receive a delivery may result in:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Delivery delays</li>
  <li>Additional charges</li>
  <li>Return-to-sender actions</li>
  <li>Delivery cancellation</li>
</ul>

<hr className="border-t border-gray-300 my-6" />

{/* Section 6 */}
<h2 className="text-2xl font-bold py-4 text-black">6. Rider Responsibilities</h2>

<p>Dispatch riders are expected to:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Maintain professionalism</li>
  <li>Handle packages responsibly</li>
  <li>Follow applicable traffic laws</li>
  <li>Deliver items to the intended destination</li>
  <li>Communicate delivery updates when necessary</li>
  <li>Comply with platform policies</li>
</ul>

<p className="py-3">Riders must not:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Tamper with package contents</li>
  <li>Deliver prohibited items knowingly</li>
  <li>Misrepresent delivery status</li>
  <li>Solicit unauthorized off-platform payments</li>
  <li>Engage in unsafe conduct</li>
</ul>

<p className="mt-3">Repeated violations may result in suspension or permanent removal from the platform.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 7 */}
<h2 className="text-2xl font-bold py-4 text-black">7. Delivery Timeframes</h2>

<p>Estimated delivery times are provided for convenience only.</p>

<p className="py-3">Actual delivery times may be affected by:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Traffic conditions</li>
  <li>Weather conditions</li>
  <li>Road closures</li>
  <li>Rider availability</li>
  <li>Package handling requirements</li>
  <li>Recipient availability</li>
  <li>Other operational circumstances</li>
</ul>

<p className="mt-3">SabiGuy does not guarantee delivery within any specific timeframe unless expressly stated.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 8 */}
<h2 className="text-2xl font-bold py-4 text-black">8. Prohibited Items</h2>

<p>The following items may not be transported through SabiGuy:</p>

<h2 className="text-xl font-bold py-2 text-black">Illegal Items</h2>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Stolen goods</li>
  <li>Illegal drugs</li>
  <li>Counterfeit products</li>
  <li>Fraudulent materials</li>
</ul>

<h2 className="text-xl font-bold py-2 text-black">Dangerous Goods</h2>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Explosives</li>
  <li>Fireworks</li>
  <li>Hazardous chemicals</li>
  <li>Toxic substances</li>
  <li>Flammable materials</li>
  <li>Radioactive materials</li>
</ul>

<h2 className="text-xl font-bold py-2 text-black">Restricted Items</h2>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Firearms</li>
  <li>Ammunition</li>
  <li>Illegal weapons</li>
  <li>Controlled substances</li>
  <li>Prohibited pharmaceuticals</li>
</ul>

<h2 className="text-xl font-bold py-2 text-black">Other Prohibited Items</h2>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Human remains</li>
  <li>Live animals (unless expressly approved)</li>
  <li>Adult materials prohibited by law</li>
  <li>Any item prohibited by applicable regulations</li>
</ul>

<p className="mt-3">SabiGuy reserves the right to refuse, cancel, or terminate delivery requests involving prohibited items.</p>

<hr className="border-t border-gray-300 my-6" />


{/* Section 9 */}
<h2 className="text-2xl font-bold py-4 text-black">9. Failed Deliveries</h2>

<p>A delivery may be considered unsuccessful where:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>The recipient cannot be reached</li>
  <li>Delivery information is inaccurate</li>
  <li>The delivery location is inaccessible</li>
  <li>Safety concerns arise</li>
  <li>The recipient refuses the package</li>
</ul>

<p className="py-3">Where a delivery cannot be completed, SabiGuy may:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Attempt redelivery</li>
  <li>Return the package to the sender</li>
  <li>Apply additional service charges</li>
  <li>Cancel the delivery request</li>
</ul>

<p className="mt-3">Applicable charges may remain payable.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 10 */}
<h2 className="text-2xl font-bold py-4 text-black">10. Lost, Damaged, or Misdelivered Items</h2>

<p>Users must report delivery issues as soon as reasonably possible.</p>

<p className="py-3">Where a report is submitted, SabiGuy may:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Review delivery records</li>
  <li>Review rider activity</li>
  <li>Request supporting evidence</li>
  <li>Conduct internal investigations</li>
</ul>

<p className="py-3">Users may be required to provide:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Delivery references</li>
  <li>Photographs</li>
  <li>Receipts</li>
  <li>Package descriptions</li>
  <li>Additional supporting documentation</li>
</ul>

<p className="py-3">Compensation, where applicable, shall be determined according to platform policies and applicable laws.</p>

<p>SabiGuy does not guarantee compensation for every reported incident.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 11 */}
<h2 className="text-2xl font-bold py-4 text-black">11. Delivery Disputes</h2>

<p>Where disputes arise relating to dispatch services, users should contact SabiGuy through approved support channels.</p>

<p className="py-3">SabiGuy may:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Review available information</li>
  <li>Facilitate communication</li>
  <li>Investigate reported issues</li>
  <li>Recommend resolutions</li>
  <li>Take enforcement action where appropriate</li>
</ul>

<p className="mt-3">SabiGuy reserves the right to make reasonable administrative decisions relating to platform operations and service integrity.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 12 */}
<h2 className="text-2xl font-bold py-4 text-black">12. Platform Payments</h2>

<p>All payments relating to dispatch services initiated through SabiGuy must be processed through approved SabiGuy payment channels unless otherwise authorized.</p>

<p className="py-3">Users and riders must not:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Conduct unauthorized off-platform payments</li>
  <li>Circumvent platform payment systems</li>
  <li>Avoid platform fees</li>
  <li>Solicit direct payments to bypass platform processes</li>
</ul>

<p className="mt-3">Violations may result in enforcement action.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 13 */}
<h2 className="text-2xl font-bold py-4 text-black">13. Independent Service Provider Status</h2>

<p>Dispatch riders operating through SabiGuy are generally independent service providers unless expressly stated otherwise.</p>

<p className="py-3">Nothing in this policy creates:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>An employment relationship</li>
  <li>A partnership</li>
  <li>A joint venture</li>
  <li>An agency relationship</li>
</ul>

<p className="mt-3">between SabiGuy and independent dispatch riders.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 14 */}
<h2 className="text-2xl font-bold py-4 text-black">14. Dispatch Service Disclaimer</h2>

<p>SabiGuy facilitates connections between customers and independent dispatch riders.</p>

<p className="py-3">To the fullest extent permitted by law, SabiGuy shall not be liable for:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Delivery delays</li>
  <li>Traffic-related disruptions</li>
  <li>Failed deliveries caused by inaccurate information</li>
  <li>Recipient unavailability</li>
  <li>External events beyond reasonable control</li>
  <li>Indirect or consequential losses</li>
</ul>

<p className="py-3">Where liability cannot be excluded by law, SabiGuy's liability shall be limited to the amount paid for the affected delivery service.</p>

<p>Users acknowledge that delivery services involve operational risks and circumstances beyond the platform's direct control.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 15 */}
<h2 className="text-2xl font-bold py-4 text-black">15. Policy Updates</h2>

<p>SabiGuy may update this Dispatch & Delivery Policy periodically to reflect:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Service improvements</li>
  <li>Operational changes</li>
  <li>Regulatory requirements</li>
  <li>Safety enhancements</li>
</ul>

<p className="py-3">Updated versions will be published with a revised effective date.</p>

<p>Continued use of dispatch services constitutes acceptance of updated policies.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 16 */}
<h2 className="text-2xl font-bold py-4 text-black">16. Contact Information</h2>

<p className="mb-3">For delivery-related questions, complaints, service issues, lost package reports, or dispute resolution requests, please contact:</p>

<div className="space-y-3">
  <p><span className="font-bold">Company:</span> Pitchers International (Operating SabiGuy)</p>
  <p><span className="font-bold">Website:</span> sabiguy.com</p>
  <p><span className="font-bold">Email:</span> info@sabiguy.com</p>
  <p><span className="font-bold">Location:</span> Ibadan, Oyo State, Nigeria</p>
</div>


<p className="py-3 font-bold text-black">End of Dispatch & Delivery Policy</p>


   </article>
     
              </Section>

           
          </main>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
