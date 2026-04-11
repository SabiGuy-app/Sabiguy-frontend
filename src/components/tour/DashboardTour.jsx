import { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/auth.store";

const G = "#1B6B35";
const TW = 278;
const ARR = 10;
const GAP = 14;

const STEPS = [
  {
    type: "modal",
    title: "Welcome back!",
    desc: "Take a quick tour of how to get a service done today",
    btn: "Continue",
  },
  {
    type: "tip",
    target: "service-cards",
    placement: "bottom",
    label: "1 of 4",
    title: "Request a service",
    desc: "Tap on any service card to quickly book what you need in just a few taps.",
    btn: "Next",
  },
  {
    type: "tip",
    target: "explore-categories",
    placement: "top",
    label: "2 of 4",
    title: "Browse Service Categories",
    desc: "Browse services by category to quickly find what you need.",
    btn: "Next",
    highlight: true,
  },
  {
    type: "tip",
    target: "notification-bell",
    placement: "bottom-right",
    label: "3 of 4",
    title: "Notifications",
    desc: "Get updates when providers accept your request.",
    btn: "Next",
  },
  {
    type: "tip",
    target: "sidebar",
    placement: "right",
    label: "4 of 4",
    title: "Menu bar",
    desc: "Use the menu to access my bookings, chats, referrals, settings, and activity history.",
    btn: "Done",
  },
  {
    type: "modal",
    title: "You're Ready to Go!",
    desc: "You've completed the dashboard tour. Remember, you can always revisit the tour or access helpful tips from the Help section.",
    btn: "Finish",
  },
];

function calcLayout(rect, placement) {
  const vw = window.innerWidth;
  let top, left, arrow = {};

  if (placement === "bottom") {
    top = rect.bottom + GAP;
    left = rect.left + rect.width / 2 - TW / 2;
    arrow = { pos: "top-center" };
  } else if (placement === "top") {
    top = rect.top - 150 - GAP;
    left = rect.left + rect.width / 2 - TW / 2;
    arrow = { pos: "bottom-center" };
  } else if (placement === "bottom-right") {
    top = rect.bottom + GAP;
    left = rect.right - TW;
    arrow = { pos: "top-right" };
  } else if (placement === "right") {
    top = rect.top + rect.height / 2 - 70;
    left = rect.right + GAP;
    arrow = { pos: "left-mid" };
  }

  left = Math.max(8, Math.min(left, vw - TW - 8));
  top = Math.max(8, top);
  return { top, left, arrow };
}

function Arrow({ pos }) {
  const base = {
    position: "absolute", width: 0, height: 0,
    border: `${ARR}px solid transparent`,
  };
  const styles = {
    "top-center":    { ...base, top: -ARR * 2, left: TW / 2 - ARR, borderBottom: `${ARR}px solid white` },
    "bottom-center": { ...base, bottom: -ARR * 2, left: TW / 2 - ARR, borderTop: `${ARR}px solid white` },
    "top-right":     { ...base, top: -ARR * 2, right: 18, borderBottom: `${ARR}px solid white` },
    "left-mid":      { ...base, top: 44, left: -ARR * 2, borderRight: `${ARR}px solid white` },
  };
  return <div style={styles[pos]} />;
}

export default function DashboardTour() {
  const [si, setSi] = useState(0);
  const [on, setOn] = useState(false); // start false — wait for user
  const [layout, setLayout] = useState(null);
  const [targetRect, setTargetRect] = useState(null);

  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);

  const userId = user?.data?._id || user?._id || null;
  const TOUR_KEY = userId ? `tourSeen_${userId}` : null;

  // Wait for auth to hydrate + user id to be available, then check localStorage
  useEffect(() => {
    if (!hydrated || !TOUR_KEY) return;
    const alreadySeen = localStorage.getItem(TOUR_KEY);
    if (!alreadySeen) setOn(true);
  }, [hydrated, TOUR_KEY]);

  const s = STEPS[si];
  const isTip = s?.type === "tip";

  // Lift the target element above the dark overlay
  useEffect(() => {
    if (!on || !isTip) return;
    const el = document.getElementById(s.target);
    if (!el) return;

    const prevZ = el.style.zIndex;
    const prevPos = el.style.position;
    const prevBg = el.style.background;

    el.style.zIndex = "10000";

    const computed = window.getComputedStyle(el).position;
    if (computed === "static") el.style.position = "relative";

    if (!el.style.background && !el.style.backgroundColor) {
      el.style.background = "white";
    }

    return () => {
      el.style.zIndex = prevZ;
      el.style.position = prevPos;
      el.style.background = prevBg;
    };
  }, [si, on]);

  // Calculate tooltip + highlight position
  useEffect(() => {
    if (!on || !isTip) { setLayout(null); setTargetRect(null); return; }

    const el = document.getElementById(s.target);
    if (!el) return;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      setLayout(calcLayout(rect, s.placement));
      setTargetRect(rect);
    };

    const id = setTimeout(compute, 120);
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, true);

    return () => {
      clearTimeout(id);
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute, true);
    };
  }, [si, on]);

  const endTour = () => {
    if (TOUR_KEY) localStorage.setItem(TOUR_KEY, "true");
    setOn(false);
  };

  const next = () => {
    if (si >= STEPS.length - 1) { endTour(); return; }
    setSi((i) => i + 1);
  };

  const skip = () => endTour();

  if (!on) return null;

  const font = { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" };

  return (
    <>
      {/* Dark overlay */}
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 9998 }} />

      {/* Green highlight border */}
      {isTip && s.highlight && targetRect && (
        <div style={{
          position: "fixed",
          top: targetRect.top - 6,
          left: targetRect.left - 6,
          width: targetRect.width + 12,
          height: targetRect.height + 12,
          border: `2.5px solid ${G}`,
          borderRadius: 14,
          zIndex: 10001,
          pointerEvents: "none",
          boxSizing: "border-box",
        }} />
      )}

      {/* Welcome / Completion modal */}
      {s.type === "modal" && (
        <div style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          background: "white", borderRadius: 16,
          padding: "28px 32px", width: 340,
          zIndex: 10002,
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          ...font,
        }}>
          <h3 style={{ margin: "0 0 10px", fontSize: 17, fontWeight: 700, color: "#111" }}>{s.title}</h3>
          <p style={{ margin: "0 0 26px", fontSize: 13.5, color: "#555", lineHeight: 1.6 }}>{s.desc}</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={skip} style={{ background: "none", border: "1px solid black", color: "#666", cursor: "pointer", fontSize: 14, padding: "5px 20px" }}>Skip</button>
            <button onClick={next} style={{ background: G, color: "white", border: "none", borderRadius: 8, padding: "9px 26px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{s.btn}</button>
          </div>
        </div>
      )}

      {/* Step tooltip */}
      {isTip && layout && (
        <div style={{
          position: "fixed",
          top: layout.top, left: layout.left,
          width: TW, background: "white",
          borderRadius: 12, padding: "16px 20px 18px",
          zIndex: 10002,
          boxShadow: "0 8px 30px rgba(0,0,0,0.14)",
          ...font,
        }}>
          <Arrow pos={layout.arrow.pos} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 14.5, color: "#111" }}>{s.title}</span>
            <span style={{ color: "#bbb", fontSize: 12 }}>{s.label}</span>
          </div>
          <p style={{ margin: "0 0 18px", fontSize: 13, color: "#555", lineHeight: 1.55 }}>{s.desc}</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={skip} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 13.5, padding: 0 }}>Skip</button>
            <button onClick={next} style={{ background: G, color: "white", border: "none", borderRadius: 8, padding: "8px 22px", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>{s.btn}</button>
          </div>
        </div>
      )}
    </>
  );
}