import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../stores/auth.store";
import { claimFirstTourVisit } from "../../utils/tourStorage";

export default function useFirstVisitTour(prefix) {
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const userId = user?.data?._id || user?._id || user?.user?._id || user?.data?.user?._id;
  const key = hydrated && userId ? `${prefix}_${userId}` : null;
  const checkedKey = useRef(null);
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    // Avoid closing a newly opened tour when StrictMode reruns this effect.
    if (checkedKey.current === key) return;
    checkedKey.current = key;
    setActiveKey(key && claimFirstTourVisit(localStorage, key) ? key : null);
  }, [key]);

  return [Boolean(key && activeKey === key), () => setActiveKey(null)];
}
