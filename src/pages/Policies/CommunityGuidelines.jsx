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

const CommunityGuidelines= () => {
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
          <Section id="community" title="COMMUNITY GUIDELINES">
            <div className="font-bold text-black">
                <h2>Effective Date: 01/06/2026</h2>
            <h2>Last Updated: 01/06/2026</h2>
             </div>
            <article>

{/* Section 1 */}
<h2 className="text-2xl font-bold py-4 text-black">1. Introduction</h2>
<p>SabiGuy is committed to building a trusted, safe, inclusive, and professional community where individuals, businesses, riders, vendors, and service providers can connect with confidence.</p>

<p className="py-3">These Community Guidelines establish the standards of behavior expected from everyone using the SabiGuy platform.</p>

<p>By creating an account or using SabiGuy, you agree to follow these guidelines and contribute positively to the community.</p>

<p className="py-3">Failure to comply may result in warnings, restrictions, suspension, or permanent removal from the platform.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 2 */}
<h2 className="text-2xl font-bold py-4 text-black">2. Respectful Conduct</h2>

<p>All users are expected to treat others with dignity, courtesy, and respect.</p>

<p className="py-3">Users should:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Communicate respectfully.</li>
  <li>Demonstrate professionalism.</li>
  <li>Respect personal boundaries.</li>
  <li>Cooperate during service interactions.</li>
  <li>Treat others fairly and honestly.</li>
</ul>

<p className="mt-3">SabiGuy seeks to foster a welcoming environment for all users regardless of background, profession, or service category.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 3 */}
<h2 className="text-2xl font-bold py-4 text-black">3. Professional Conduct</h2>

<p>Whether you are a customer, rider, vendor, or service provider, professionalism is expected at all times.</p>

<p className="py-3">Users should:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Honor commitments made through the platform.</li>
  <li>Arrive on time where applicable.</li>
  <li>Provide accurate information.</li>
  <li>Communicate clearly and honestly.</li>
  <li>Deliver services responsibly.</li>
  <li>Respect agreed service terms.</li>
</ul>

<p className="mt-3">Professional conduct strengthens trust throughout the platform ecosystem.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 4 */}
<h2 className="text-2xl font-bold py-4 text-black">4. Harassment, Abuse & Discrimination</h2>

<p>SabiGuy maintains a zero-tolerance policy for harassment, abuse, intimidation, and discrimination.</p>

<p className="py-3">Users must not engage in:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Verbal abuse</li>
  <li>Threats or intimidation</li>
  <li>Bullying</li>
  <li>Stalking</li>
  <li>Harassment</li>
  <li>Hate speech</li>
  <li>Discriminatory behavior</li>
  <li>Offensive or degrading conduct</li>
</ul>

<p className="py-3">This policy applies to all interactions occurring through the platform or arising from services facilitated through SabiGuy.</p>

<p>Violations may result in immediate enforcement action.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 5 */}
<h2 className="text-2xl font-bold py-4 text-black">5. Fraud & Misrepresentation</h2>

<p>Trust is essential to the SabiGuy community.</p>

<p className="py-3">Users must not:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Create fake accounts</li>
  <li>Impersonate individuals or businesses</li>
  <li>Submit false information</li>
  <li>Misrepresent qualifications</li>
  <li>Provide misleading service descriptions</li>
  <li>Submit fraudulent complaints</li>
  <li>Engage in deceptive practices</li>
</ul>

<p className="mt-3">Any attempt to deceive users or the platform may result in suspension or permanent account termination.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 6 */}
<h2 className="text-2xl font-bold py-4 text-black">6. Platform Circumvention</h2>

<p>SabiGuy exists to facilitate trusted interactions while providing safety measures, payment protection, dispute resolution support, and accountability mechanisms.</p>

<p className="py-3">Users and service providers must not:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Conduct off-platform transactions for services initiated through SabiGuy.</li>
  <li>Avoid platform fees or commissions.</li>
  <li>Solicit off-platform payments.</li>
  <li>Use SabiGuy solely to acquire customers outside the platform.</li>
  <li>Encourage users to bypass approved communication or payment channels.</li>
</ul>

<p className="mt-3">Violations may result in restrictions, suspension, or removal from the platform.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 7 */}
<h2 className="text-2xl font-bold py-4 text-black">7. Ratings & Reviews</h2>

<p>Ratings and reviews help maintain transparency and accountability.</p>

<p className="py-3">Users are encouraged to provide feedback that is:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Honest</li>
  <li>Respectful</li>
  <li>Relevant</li>
  <li>Based on actual experiences</li>
</ul>

<p className="py-3">Users must not:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Submit fake reviews</li>
  <li>Manipulate ratings</li>
  <li>Purchase reviews</li>
  <li>Exchange incentives for reviews</li>
  <li>Harass others through reviews</li>
</ul>

<p className="mt-3">SabiGuy reserves the right to remove reviews that violate these guidelines.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 8 */}
<h2 className="text-2xl font-bold py-4 text-black">8. Safety & Security</h2>

<p>All users share responsibility for maintaining a safe environment.</p>

<p className="py-3">Users are encouraged to:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Verify service details before engagement.</li>
  <li>Report suspicious activity.</li>
  <li>Protect account credentials.</li>
  <li>Use approved payment channels.</li>
  <li>Follow applicable laws and safety standards.</li>
  <li>Report misconduct promptly.</li>
</ul>

<p className="mt-3">Where immediate safety concerns arise, users should contact emergency services or law enforcement authorities first.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 9 */}
<h2 className="text-2xl font-bold py-4 text-black">9. Spam & Unwanted Content</h2>

<p>Users must not use SabiGuy to distribute:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Spam messages</li>
  <li>Repetitive content</li>
  <li>Unauthorized advertisements</li>
  <li>Misleading promotions</li>
  <li>Irrelevant solicitations</li>
  <li>Malicious links</li>
  <li>Harmful software</li>
</ul>

<p className="mt-3">SabiGuy reserves the right to remove such content and restrict offending accounts.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 10 */}
<h2 className="text-2xl font-bold py-4 text-black">10. Responsible Use of the Platform</h2>

<p>Users are expected to use the platform only for legitimate purposes.</p>

<p className="py-3">Users must not:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Abuse platform features</li>
  <li>Manipulate platform systems</li>
  <li>Exploit technical vulnerabilities</li>
  <li>Interfere with platform operations</li>
  <li>Attempt unauthorized access</li>
  <li>Circumvent verification processes</li>
</ul>

<p className="mt-3">Responsible use helps ensure a positive experience for everyone.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 11 */}
<h2 className="text-2xl font-bold py-4 text-black">11. Community Enforcement</h2>

<p>To maintain community standards, SabiGuy may take enforcement actions where violations occur.</p>

<p className="py-3">Actions may include:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Educational warnings</li>
  <li>Content removal</li>
  <li>Listing removal</li>
  <li>Temporary restrictions</li>
  <li>Suspension of platform privileges</li>
  <li>Removal of verification status</li>
  <li>Permanent account termination</li>
  <li>Referral to law enforcement authorities where appropriate</li>
</ul>

<p className="mt-3">Enforcement decisions are based on factors including severity, frequency, intent, and impact.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 12 */}
<h2 className="text-2xl font-bold py-4 text-black">12. Repeat Violations</h2>

<p>Users who repeatedly violate community standards may face escalating enforcement actions.</p>

<p className="py-3">Repeated violations may result in:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Increased monitoring</li>
  <li>Temporary suspensions</li>
  <li>Permanent removal from the platform</li>
  <li>Loss of verification privileges</li>
  <li>Restrictions on future participation</li>
</ul>

<p className="mt-3">SabiGuy reserves the right to determine whether a pattern of misconduct exists.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 13 */}
<h2 className="text-2xl font-bold py-4 text-black">13. Reporting Violations</h2>

<p>Users are encouraged to report violations of these Community Guidelines.</p>

<p className="py-3">Reports may relate to:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Harassment</li>
  <li>Fraud</li>
  <li>Abuse</li>
  <li>Misrepresentation</li>
  <li>Unsafe conduct</li>
  <li>Spam</li>
  <li>Platform abuse</li>
  <li>Policy violations</li>
</ul>

<p className="py-3">Reports should include sufficient information to assist with investigation.</p>

<p>Knowingly submitting false reports may itself constitute a policy violation.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 14 */}
<h2 className="text-2xl font-bold py-4 text-black">14. Building a Trusted Community</h2>

<p>SabiGuy exists to make it easier for people to access trusted services, reliable transportation, and dependable delivery solutions.</p>

<p className="py-3">Every member of the community contributes to that mission.</p>

<p>By using SabiGuy, users agree to uphold the values of:</p>

<ul className="list-disc list-inside mt-2 space-y-1 px-7">
  <li>Trust</li>
  <li>Integrity</li>
  <li>Professionalism</li>
  <li>Accountability</li>
  <li>Respect</li>
  <li>Safety</li>
</ul>

<p className="mt-3">Together, these principles help create a platform that benefits customers, providers, businesses, and the wider community.</p>

<hr className="border-t border-gray-300 my-6" />

{/* Section 15 */}
<h2 className="text-2xl font-bold py-4 text-black">15. Contact Information</h2>

<p className="mb-3">For questions, concerns, or reports relating to these Community Guidelines, please contact:</p>

<div className="space-y-3">
  <p><span className="font-bold">Company:</span> Pitchers International (Operating SabiGuy)</p>
  <p><span className="font-bold">Website:</span> sabiguy.com</p>
  <p><span className="font-bold">Email:</span> info@sabiguy.com</p>
  <p><span className="font-bold">Location:</span> Ibadan, Oyo State, Nigeria</p>
</div>


<p className="font-bold text-black py-3">End of Community Guidelines</p>

</article>
     
              </Section>

           
          </main>
        </div>
      </div>
      <LandingFooter />
    </div>
  );
};

export default CommunityGuidelines;
