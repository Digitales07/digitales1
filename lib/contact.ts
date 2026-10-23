// Single source of truth for real contact details (phones, emails, addresses).
// Import from here in the contact page, footer and schema so a placeholder can
// never appear on one page while the real number shows on another.
// If an office has no public phone, leave it null - never show a dummy number.

export const OFFICES = [
  {
    name: "Pakistan HQ",
    city: "Lahore",
    flag: "🇵🇰",
    phone: "+92 334 8138456",
    email: "admin@digitales.pk",
    address: "82-B Garden Block, Garden Town, Lahore, Pakistan, 54000",
    searchLabel: "Garden Town, LHR",
  },
  {
    name: "UK Chapter",
    city: "London",
    flag: "🇬🇧",
    phone: null,
    email: "info@digitalesuk.com",
    address: "71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom",
    searchLabel: "Covent Garden, LDN",
  },
  {
    name: "USA Chapter",
    city: "New York",
    flag: "🇺🇸",
    phone: null,
    email: "admin@digitalesusa.org",
    address: "135 Madison Ave, New York, NY 10016, United States",
    searchLabel: "Madison Ave, NYC",
  },
] as const;

export type Office = (typeof OFFICES)[number];
export type OfficeName = Office["name"];

/** "+92 334 8138456" -> "+923348138456" for tel: links. */
export function toTelHref(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}
