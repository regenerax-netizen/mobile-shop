import type { CarrierTracking } from "@/types";

export interface CarrierAdapter {
  carrier: string;
  generateTrackingUrl(trackingNumber: string): string;
}

const CARRIER_URL_TEMPLATES: Record<string, string> = {
  dhl: "https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode={tracking}",
  dpd: "https://tracking.dpd.de/parcelstatus?query={tracking}&locale=de_DE",
  ups: "https://www.ups.com/track?tracknum={tracking}&loc=de_DE",
  hermes:
    "https://www.myhermes.de/empfangen/sendungsverfolgung/sendungsinformation#{tracking}",
  gls: "https://gls-group.eu/DE/de/paketverfolgung?match={tracking}",
};

export function getTrackingUrl(
  carrier: string,
  trackingNumber: string,
): string {
  const template = CARRIER_URL_TEMPLATES[carrier.toLowerCase()];
  if (!template) return "";
  return template.replace("{tracking}", encodeURIComponent(trackingNumber));
}

export function buildCarrierTracking(
  carrier: string,
  trackingNumber: string,
): CarrierTracking {
  return {
    carrier,
    tracking_number: trackingNumber,
    tracking_url: getTrackingUrl(carrier, trackingNumber),
  };
}

export const SUPPORTED_CARRIERS = Object.keys(CARRIER_URL_TEMPLATES);
