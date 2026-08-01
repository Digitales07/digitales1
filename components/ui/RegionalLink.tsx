"use client";

import { Suspense, type ComponentProps } from "react";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";

type RegionalLinkProps = ComponentProps<typeof NextLink>;

const REGIONAL_DOMAINS = new Set(["digitalesuk.com", "digitalesusa.org"]);

function RegionalLinkWithParams({ href, ...props }: RegionalLinkProps) {
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain")?.toLowerCase();
  let regionalHref = href;

  if (
    typeof href === "string" &&
    href.startsWith("/") &&
    !href.startsWith("//") &&
    domain &&
    REGIONAL_DOMAINS.has(domain)
  ) {
    const destination = new URL(href, "https://digitales.local");
    destination.searchParams.set("domain", domain);
    regionalHref = `${destination.pathname}${destination.search}${destination.hash}`;
  }

  return <NextLink href={regionalHref} {...props} />;
}

export default function RegionalLink(props: RegionalLinkProps) {
  return (
    <Suspense fallback={<NextLink {...props} />}>
      <RegionalLinkWithParams {...props} />
    </Suspense>
  );
}
