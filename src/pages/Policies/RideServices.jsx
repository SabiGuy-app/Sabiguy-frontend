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
          <Section id="ride-services" title="RIDE SERVICES POLICY">
            <div className="font-bold text-black">
                <h2>Effective Date: 01/06/2026</h2>
            <h2>Last Updated: 01/06/2026</h2>
             </div>
            

<article>

{/* Section 
1 */}
<h2 className="text-2xl font-bold py-4 text-black">1. Introduction</h2>

<p>This Ride Services Policy governs the use of ride services facilitated through the SabiGuy platform.</p>

<p className="py-3">SabiGuy connects passengers with independent riders to provide transportation services in a convenient, reliable, and safe manner.</p>

<p>By requesting, accepting, providing, or participating in ride services through SabiGuy, users agree to comply with this policy.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 2 */}
<h2 className="text-2xl font-bold py-4 text-black">2. Nature of Ride Services</h2>

<p>SabiGuy is a technology platform that facilitates ride requests between passengers and independent riders.</p>

<p className="py-3">Unless expressly stated otherwise:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Riders are independent service providers.</li>
  <li>SabiGuy does not own all vehicles used on the platform.</li>
  <li>SabiGuy does not employ all riders.</li>
  <li>SabiGuy facilitates ride matching, communication, payment processing, and service coordination.</li>
</ul>

<p className="mt-3">Ride services are subject to availability, operational conditions, and platform requirements.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 3 */}
<h2 className="text-2xl font-bold py-4 text-black">3. Ride Requests</h2>

<p>Passengers may request rides through approved SabiGuy channels.</p>

<p className="py-3">By requesting a ride, passengers agree to:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Provide accurate pickup information.</li>
  <li>Provide accurate destination information.</li>
  <li>Be available at the pickup location.</li>
  <li>Use the platform responsibly.</li>
  <li>Comply with applicable laws and safety requirements.</li>
</ul>

<p className="mt-3">Ride requests may be declined, cancelled, or reassigned where operational circumstances require.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 4 */}
<h2 className="text-2xl font-bold py-4 text-black">4. Passenger Responsibilities</h2>

<p className="mb-3">Passengers are expected to:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Treat riders respectfully.</li>
  <li>Provide accurate ride information.</li>
  <li>Follow reasonable rider instructions.</li>
  <li>Use seat belts where available.</li>
  <li>Avoid disruptive behavior.</li>
  <li>Respect applicable laws and regulations.</li>
</ul>

<p className="py-3">Passengers must not:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Harass riders.</li>
  <li>Damage vehicles.</li>
  <li>Transport prohibited items.</li>
  <li>Engage in illegal activities.</li>
  <li>Threaten or intimidate riders.</li>
</ul>

<p className="mt-3">Passengers may be held responsible for damages caused through misconduct or negligence.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 5 */}
<h2 className="text-2xl font-bold py-4 text-black">5. Rider Responsibilities</h2>

<p className="mb-3">Riders using the platform are expected to:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Maintain professionalism.</li>
  <li>Provide safe transportation services.</li>
  <li>Comply with applicable laws and traffic regulations.</li>
  <li>Maintain valid licenses where required.</li>
  <li>Keep accurate profile information.</li>
  <li>Respect passengers.</li>
  <li>Complete accepted ride requests responsibly.</li>
</ul>

<p className="py-3">Riders must not:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Misrepresent their identity.</li>
  <li>Operate under the influence of drugs or alcohol.</li>
  <li>Engage in reckless behavior.</li>
  <li>Solicit unauthorized off-platform transactions.</li>
  <li>Harass or discriminate against passengers.</li>
</ul>

<p className="mt-3">Repeated violations may result in suspension or removal from the platform.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 6 */}
<h2 className="text-2xl font-bold py-4 text-black">6. Safety Requirements</h2>

<p>Safety is a shared responsibility.</p>

<p className="py-3">Passengers and riders are encouraged to:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Verify ride details before departure.</li>
  <li>Confirm identities where appropriate.</li>
  <li>Use approved platform features.</li>
  <li>Report safety concerns immediately.</li>
  <li>Follow traffic and transportation laws.</li>
</ul>

<p className="mt-3">SabiGuy may introduce additional safety measures from time to time, including verification requirements, monitoring systems, emergency support features, and compliance reviews.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 7 */}
<h2 className="text-2xl font-bold py-4 text-black">7. Ride Pricing & Payments</h2>

<p>Ride pricing may be determined based on factors including:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Distance travelled</li>
  <li>Estimated travel time</li>
  <li>Service availability</li>
  <li>Operational demand</li>
  <li>Applicable platform fees</li>
</ul>

<p className="py-3">All payments for rides initiated through SabiGuy must be processed through approved SabiGuy payment channels unless otherwise authorized by the platform.</p>

<p>Attempts to bypass platform payment systems may result in enforcement action.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 8 */}
<h2 className="text-2xl font-bold py-4 text-black">8. Ride Cancellations</h2>

<p>Passengers and riders may cancel rides under certain circumstances.</p>

<p className="py-3">Cancellation fees may apply where:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>A rider has already been assigned.</li>
  <li>The rider has arrived at the pickup location.</li>
  <li>Platform resources have been committed to the request.</li>
</ul>

<p className="py-3">SabiGuy reserves the right to determine applicable cancellation policies and fees.</p>

<p>Repeated cancellation abuse may result in account restrictions.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 9 */}
<h2 className="text-2xl font-bold py-4 text-black">9. Ride Delays</h2>

<p>Ride arrival times are estimates only.</p>

<p className="py-3">Delays may occur due to:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Traffic conditions</li>
  <li>Weather conditions</li>
  <li>Road closures</li>
  <li>Vehicle issues</li>
  <li>Rider availability</li>
  <li>Events beyond reasonable control</li>
</ul>

<p className="mt-3">SabiGuy does not guarantee arrival times and shall not be responsible for delays caused by circumstances outside its reasonable control.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 10 */}
<h2 className="text-2xl font-bold py-4 text-black">10. Lost Items</h2>

<p>Passengers are responsible for ensuring they take their personal belongings at the end of a ride.</p>

<p className="py-3">Where an item is reported lost:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>SabiGuy may attempt to facilitate communication between the passenger and rider.</li>
  <li>Recovery of lost items cannot be guaranteed.</li>
  <li>Additional fees may apply where item recovery requires additional travel or coordination.</li>
</ul>

<p className="mt-3">Neither SabiGuy nor riders guarantee the recovery of lost property.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 11 */}
<h2 className="text-2xl font-bold py-4 text-black">11. Ride Disputes</h2>

<p>Where disputes arise relating to ride services, users are encouraged to contact SabiGuy through approved support channels.</p>

<p className="py-3">SabiGuy may:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Review ride records.</li>
  <li>Review payment records.</li>
  <li>Request supporting information.</li>
  <li>Facilitate communication between parties.</li>
  <li>Take enforcement action where appropriate.</li>
</ul>

<p className="mt-3">SabiGuy reserves the right to make reasonable administrative decisions relating to platform operations and safety.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 12 */}
<h2 className="text-2xl font-bold py-4 text-black">12. Prohibited Conduct During Rides</h2>

<p>Passengers and riders must not engage in:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Violence or threats</li>
  <li>Harassment</li>
  <li>Discrimination</li>
  <li>Criminal activity</li>
  <li>Transport of prohibited items</li>
  <li>Property damage</li>
  <li>Fraudulent activity</li>
  <li>Unsafe conduct</li>
</ul>

<p className="mt-3">Violations may result in immediate suspension or permanent removal from the platform.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 13 */}
<h2 className="text-2xl font-bold py-4 text-black">13. Independent Service Provider Status</h2>

<p>Riders operating through SabiGuy are generally independent service providers unless otherwise stated.</p>

<p className="py-3">Nothing in this policy creates:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>An employment relationship</li>
  <li>A partnership</li>
  <li>A joint venture</li>
  <li>An agency relationship</li>
</ul>

<p className="mt-3">between SabiGuy and independent riders.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 14 */}
<h2 className="text-2xl font-bold py-4 text-black">14. Limitation of Ride Liability</h2>

<p>To the fullest extent permitted by law, SabiGuy shall not be liable for:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Traffic delays</li>
  <li>Route deviations</li>
  <li>Rider misconduct</li>
  <li>Service interruptions</li>
  <li>Accidents caused by third parties</li>
  <li>Personal property losses</li>
  <li>Events beyond reasonable operational control</li>
</ul>

<p className="py-3">Where liability cannot be excluded by law, SabiGuy's liability shall be limited to the amount paid for the affected ride service.</p>

<p>Users acknowledge that transportation services involve inherent risks.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 15 */}
<h2 className="text-2xl font-bold py-4 text-black">15. Policy Updates</h2>

<p>SabiGuy may update this Ride Services Policy periodically to reflect:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Service improvements</li>
  <li>Regulatory requirements</li>
  <li>Operational changes</li>
  <li>Safety enhancements</li>
</ul>

<p className="py-3">Updated versions will be published with a revised effective date.</p>

<p>Continued use of ride services constitutes acceptance of updated policies.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 16 */}
<h2 className="text-2xl font-bold py-4 text-black">16. Contact Information</h2>

<p className="mb-3">For ride-related questions, complaints, safety concerns, or dispute resolution requests, please contact:</p>

<div className="space-y-3">
  <p><span className="font-bold">Company:</span> Pitchers International (Operating SabiGuy)</p>
  <p><span className="font-bold">Website:</span> sabiguy.com</p>
  <p><span className="font-bold">Email:</span> info@sabiguy.com</p>
  <p><span className="font-bold">Location:</span> Ibadan, Oyo State, Nigeria</p>
</div>

<div className="space-y-3 py-4">
  <p>Pitchers International (Operating SabiGuy)</p>
  <p>Website: sabiguy.com</p>
  <p>Email: info@sabiguy.com</p>
  <p>Location: Ibadan, Oyo State, Nigeria</p>
</div>

<p className="font-bold text-black">End of Ride Services Policy</p>

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
