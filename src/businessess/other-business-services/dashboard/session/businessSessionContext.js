import { createContext, useContext } from "react";

export const BusinessSessionContext = createContext(null);

// Availability, presence and notifications shared by every dashboard page.
export function useBusinessSession() {
  const session = useContext(BusinessSessionContext);
  if (!session) {
    throw new Error("useBusinessSession must be used inside the BusinessSession route");
  }
  return session;
}
