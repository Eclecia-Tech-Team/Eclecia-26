import type { Metadata } from "next";
import { ComingSoon } from "@/components/common/ComingSoon";

export const metadata: Metadata = {
  title: "Schedule: Eclecia'26",
  description:
    "The full day-wise schedule for Eclecia'26 will be announced soon.",
};

export default function SchedulePage() {
  return (
    <ComingSoon
      eyebrow="Schedule"
      note="Day-wise event timings, performance slots and stage schedules are coming soon."
    />
  );
}
