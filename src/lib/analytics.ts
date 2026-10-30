const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

type GtagCommand = "config" | "js";
type GtagArguments = [GtagCommand, ...unknown[]];

declare global {
  interface Window {
    dataLayer: unknown[];
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
  const gtag = function gtag() {
    // Google's command queue requires the native Arguments object, not an array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  } as Window["gtag"];
  window.gtag = window.gtag || gtag;

  if (!document.querySelector(`script[data-ga-measurement-id="${measurementId}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.dataset.gaMeasurementId = measurementId;
    document.head.appendChild(script);
  }

  window.gtag("js", new Date());
  window.gtag("config", measurementId);
};
