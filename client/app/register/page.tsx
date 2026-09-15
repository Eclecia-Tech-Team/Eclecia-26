import type { Metadata } from "next";
import { ComingSoon } from "../ComingSoon";

export const metadata: Metadata = {
  title: "Register for Eclecia'26",
  description: "Registrations for Eclecia'26 open soon.",
};

export default function RegisterPage() {
  return (
    <ComingSoon
      eyebrow="Registrations"
      note="Registrations open soon. Follow @eclecia_hitk for the announcement."
    />
  );
}
