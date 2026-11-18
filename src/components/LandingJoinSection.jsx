import { Link } from "react-router-dom";

export default function LandingJoinSection({ onJoinProvider }) {
  return (
    <section aria-labelledby="landing-join-heading" className="bg-white pb-20 md:pb-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
        <div className="rounded-[28px] bg-[#172B21] px-6 py-16 text-center text-white md:py-20">
          <h2 id="landing-join-heading" className="landing-section-heading mx-auto max-w-[900px]">Join the people and businesses<br className="hidden md:block" /> getting things done with SabiGuy.</h2>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/signup" className="rounded-lg bg-[#347B54] px-6 py-4 text-sm font-semibold text-white hover:bg-[#286642]">Request a SabiGuy</Link>
            <button type="button" onClick={onJoinProvider} className="rounded-lg bg-white px-6 py-4 text-sm font-semibold text-[#333333] hover:bg-[#EDF5F0]">Earn with SabiGuy</button>
          </div>
        </div>
      </div>
    </section>
  );
}
