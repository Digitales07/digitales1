"use client";

import { useState } from "react";

type ToolPlatformLogoProps = {
  name: string;
  src?: string;
  accent?: string;
};

function getToolMark(name: string) {
  const marks: Record<string, string> = {
    SEMrush: "SE",
    Ahrefs: "AH",
    Moz: "MO",
    "Screaming Frog": "SF",
    "Google Search Console": "GSC",
    "Google Analytics 4": "GA4",
    "Google Ads": "GAds",
    "Meta Ads": "META",
    "TikTok Ads": "TT",
    "LinkedIn Ads": "IN",
    "Microsoft Bing": "B",
    YouTube: "YT",
    Instagram: "IG",
    TikTok: "TT",
    LinkedIn: "IN",
    Facebook: "FB",
    X: "X",
    React: "RE",
    "Next.js": "N",
    Laravel: "LA",
    Flutter: "FL",
    WordPress: "WP",
    Shopify: "SH",
    WooCommerce: "WOO",
    Magento: "MA",
  };

  return marks[name] ?? name.slice(0, 2).toUpperCase();
}

export default function ToolPlatformLogo({ name, src, accent }: ToolPlatformLogoProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span
        className="grid h-11 min-w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] px-2 font-display text-sm font-extrabold tracking-[-0.04em] text-gold transition duration-300 group-hover:scale-105 group-hover:border-gold/30 group-hover:bg-gold/10"
        style={accent ? { color: accent } : undefined}
        aria-label={name}
      >
        {getToolMark(name)}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} logo`}
      width="44"
      height="44"
      loading="lazy"
      className="h-11 w-11 object-contain transition duration-300 group-hover:scale-105"
      onError={() => setFailed(true)}
    />
  );
}
