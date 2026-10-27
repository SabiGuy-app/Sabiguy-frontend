export const EVENT_SERVICE_OPTIONS = [
  { id: "event-planner", name: "Event Planner" },
  { id: "event-coordination", name: "Event Coordination" },
  { id: "catering", name: "Catering" },
  { id: "small-chops", name: "Small Chops" },
  { id: "cake-vendors", name: "Cake Vendors" },
  { id: "dj", name: "DJ" },
  { id: "mc", name: "MC" },
  { id: "live-bands", name: "Live Bands" },
  { id: "comedians", name: "Comedians" },
  { id: "event-photography", name: "Event Photography" },
  { id: "ushers", name: "Ushers" },
  { id: "event-videography", name: "Event Videography" },
  { id: "decorators", name: "Decorators" },
  { id: "protocol-officers", name: "Protocol Officers" },
  { id: "event-planner", name: "Event Planner" },

  
];

export const EVENT_SERVICE_NAMES = EVENT_SERVICE_OPTIONS.map(
  (service) => service.name,
);

export const EVENT_PROVIDER_SEARCH_NAMES = [
  ...EVENT_SERVICE_NAMES,
  "Event Planner",
];
