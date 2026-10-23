import type { Metadata } from "next";
import Placeholder from "@/components/ui/Placeholder";

export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: { canonical: "/terms-of-service" },
};

export default function TermsPage() {
  return (
    <Placeholder
      title="Terms of Service"
      blurb="Legal copy to be supplied."
    />
  );
}
