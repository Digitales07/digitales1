"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";

const SERVICES_OPTIONS = [
  "Social Media Marketing",
  "Digital Media Buying",
  "Digital PR & Influencer",
  "SEO",
  "Web & App Development",
  "Enterprise Software",
  "Relief OS",
  "DartX",
  "Not sure - advise me",
];

function getSourceDomain() {
  if (typeof window === "undefined") {
    return "";
  }

  const testDomain = new URLSearchParams(window.location.search).get("domain");
  const hostname = window.location.hostname.toLowerCase();
  const isDemoHost = ["localhost", "127.0.0.1"].includes(hostname) || hostname.endsWith(".vercel.app");
  const isRegionalDomain = testDomain && ["digitalesuk.com", "digitalesusa.org"].includes(testDomain.toLowerCase());

  if (isDemoHost && isRegionalDomain) {
    return testDomain.toLowerCase();
  }

  return hostname;
}

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sourceDomain, setSourceDomain] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    setSourceDomain(getSourceDomain());
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    if ((form.elements.namedItem("company_url") as HTMLInputElement)?.value) return; // honeypot

    setLoading(true);
    setError("");

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      services: formData.getAll("services").map((service) => String(service)),
      message: String(formData.get("message") || ""),
      sourceDomain: sourceDomain || getSourceDomain() || "unknown",
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);
      const successfulStatus = response.status === 200 || response.status === 201;

      if (!successfulStatus || !result?.ok) {
        throw new Error(result?.error || `HTTP ${response.status}`);
      }

      setSent(true);
      form.reset();
      setSelectedServices([]);
    } catch (err: any) {
      setError(err.message || "We could not send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-card border border-white/[0.08] bg-night-surface p-10 text-center">
        <CheckCircle size={44} weight="fill" className="text-gold" />
        <h3 className="mt-4 font-display text-xl font-semibold text-white">Message received.</h3>
        <p className="mt-2 max-w-sm font-body text-sm text-muted">
          Thanks our team will respond within one business day. For anything
          urgent, book a discovery call directly below.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-card border border-white/[0.08] bg-night-surface p-7 sm:p-8">
      {/* honeypot */}
      <input type="text" name="company_url" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name" name="name" placeholder="Your name" required />
        <Field label="Email Address" name="email" type="email" placeholder="you@company.com" required />
      </div>

      <div className="mt-5">
        <Field label="Phone Number" name="phone" type="tel" placeholder="Your phone number" />
      </div>

      <fieldset className="mt-5">
        <legend className="font-body text-xs font-medium uppercase tracking-wider text-muted">Services of Interest</legend>
        <details className="group relative mt-2">
          <summary className="flex w-full cursor-pointer list-none items-center justify-between rounded-lg border border-white/12 bg-night px-4 py-3 font-body text-sm text-white transition hover:border-gold/40 focus:outline-none [&::-webkit-details-marker]:hidden">
            <span className={selectedServices.length ? "text-white" : "text-muted/60"}>
              {selectedServices.length === 0
                ? "Select services"
                : selectedServices.length === 1
                  ? selectedServices[0]
                  : `${selectedServices.length} services selected`}
            </span>
            <span aria-hidden className="ml-3 text-gold transition-transform duration-200 group-open:rotate-180">⌄</span>
          </summary>

          <div className="absolute left-0 right-0 z-30 mt-2 max-h-72 overflow-y-auto rounded-lg border border-white/12 bg-night-surface p-2 shadow-2xl">
            {SERVICES_OPTIONS.map((service) => {
              const checked = selectedServices.includes(service);

              return (
                <label
                  key={service}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 font-body text-sm text-white transition hover:bg-white/[0.05]"
                >
                  <input
                    type="checkbox"
                    name="services"
                    value={service}
                    checked={checked}
                    onChange={() =>
                      setSelectedServices((current) =>
                        current.includes(service)
                          ? current.filter((item) => item !== service)
                          : [...current, service]
                      )
                    }
                    className="h-4 w-4 accent-gold"
                  />
                  <span>{service}</span>
                </label>
              );
            })}
          </div>
        </details>
        <p className="mt-1.5 font-body text-xs text-muted/80">You can select more than one service.</p>
      </fieldset>

      <div className="mt-5">
        <label className="font-body text-xs font-medium uppercase tracking-wider text-muted">Tell us about your project</label>
        <textarea
          name="message"
          rows={4}
          required
          placeholder="Tell us about your goals…"
          className="mt-2 w-full resize-none rounded-lg border border-white/12 bg-night px-4 py-3 font-body text-sm text-white placeholder:text-muted/60 focus:border-gold/60 focus:outline-none"
        />
      </div>

      {error && (
        <p className="mt-5 rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-3 font-body text-sm text-red-200">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-gold mt-7 w-full disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "Sending..." : "Send Message"} <ArrowRight size={16} weight="bold" />
      </button>
    </form>
  );
}

function Field({
  label, name, type = "text", placeholder, required,
}: {
  label: string; name: string; type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="font-body text-xs font-medium uppercase tracking-wider text-muted">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-white/12 bg-night px-4 py-3 font-body text-sm text-white placeholder:text-muted/60 focus:border-gold/60 focus:outline-none"
      />
    </div>
  );
}
