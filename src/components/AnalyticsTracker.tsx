import { useEffect } from "react";
import { initializeAnalytics } from "@/lib/analytics";

const AnalyticsTracker = () => {
  useEffect(() => {
    initializeAnalytics();
  }, []);

  return null;
};

export default AnalyticsTracker;
