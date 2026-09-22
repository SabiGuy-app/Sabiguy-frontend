import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID;

let gaInitialized = false;
let clarityInitialized = false;

const sanitizeEventParams = (params = {}) =>
  Object.entries(params).reduce((safeParams, [key, value]) => {
    if (value === undefined || value === null || value === "") return safeParams;
    if (typeof value === "number" || typeof value === "boolean") {
      safeParams[key] = value;
      return safeParams;
    }
    safeParams[key] = String(value);
    return safeParams;
  }, {});

export const initAnalytics = () => {
  if (GA_MEASUREMENT_ID && !gaInitialized) {
    ReactGA.initialize(GA_MEASUREMENT_ID);
    gaInitialized = true;
  }

  if (CLARITY_PROJECT_ID && !clarityInitialized && typeof window !== "undefined") {
    window.clarity =
      window.clarity ||
      function clarityQueue() {
        (window.clarity.q = window.clarity.q || []).push(arguments);
      };

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;

    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode.insertBefore(script, firstScript);
    clarityInitialized = true;
  }
};

export const trackEvent = (eventName, params = {}) => {
  if (!eventName) return;

  const eventParams = sanitizeEventParams(params);

  if (GA_MEASUREMENT_ID && gaInitialized) {
    ReactGA.event(eventName, eventParams);
  }

  if (
    CLARITY_PROJECT_ID &&
    clarityInitialized &&
    typeof window !== "undefined" &&
    typeof window.clarity === "function"
  ) {
    window.clarity("event", eventName);
  }
};

export const trackPageView = (path) => {
  if (!path) return;

  if (GA_MEASUREMENT_ID && gaInitialized) {
    ReactGA.send({ hitType: "pageview", page: path });
  }

  if (
    CLARITY_PROJECT_ID &&
    clarityInitialized &&
    typeof window !== "undefined" &&
    typeof window.clarity === "function"
  ) {
    window.clarity("set", "page", path);
  }
};
