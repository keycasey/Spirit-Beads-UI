const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

type GtagCommand = "config" | "event" | "js";
type GtagArguments = [GtagCommand, ...unknown[]];

declare global {
  interface Window {
    dataLayer: GtagArguments[];
    gtag: (...args: GtagArguments) => void;
  }
}

const isValidMeasurementId = (value: string | undefined): value is string =>
  Boolean(value && /^G-[A-Z0-9]+$/i.test(value));

export const isAnalyticsEnabled =
  import.meta.env.PROD && isValidMeasurementId(measurementId);

export const initializeAnalytics = () => {
  if (!isAnalyticsEnabled || typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(...args: GtagArguments) {
    window.dataLayer.push(args);
  };

  if (!document.querySelector(`script[data-ga-measurement-id="${measurementId}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.dataset.gaMeasurementId = measurementId;
    document.head.appendChild(script);
  }

  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: false });
};
export const trackPageView = (pagePath: string) => {
  if (!isAnalyticsEnabled || typeof window === "undefined") return;

  window.gtag("event", "page_view", {
    page_location: window.location.href,
    page_path: pagePath,
    page_title: document.title,
  });
};
