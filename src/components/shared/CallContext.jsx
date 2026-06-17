import { createContext, useContext } from "react";

export const CallContext = createContext(null);

export const useCallContext = () => useContext(CallContext);
