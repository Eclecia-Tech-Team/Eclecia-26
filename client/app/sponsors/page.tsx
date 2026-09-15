import type { Metadata } from "next";
import SponsorsView from "./SponsorsView";

export const metadata: Metadata = {
  title: "Sponsors: Eclecia'26",
  description:
    "Partner with Eclecia'26, the annual cultural fest of HITK Kolkata. 20,000+ footfall, 40+ colleges, 25+ events, 200,000+ social reach.",
};

export default function SponsorsPage() {
  return <SponsorsView />;
}
