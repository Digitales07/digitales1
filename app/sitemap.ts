import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { CASE_STUDIES, SERVICES } from "@/lib/site";

const BASE_URL = "https://www.digitales.pk";
const APP_DIR = "app";

// Routes that exist in the app but should not be indexed/listed in the sitemap.
// /terms is a legacy placeholder; /terms-of-service is the canonical legal page.
const EXCLUDE = new Set(["/terms"]);

type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

type RouteSettings = {
  changeFrequency: ChangeFrequency;
  priority: number;
};

const ROUTE_SETTINGS: Record<string, RouteSettings> = {
  "/": { changeFrequency: "weekly", priority: 1.0 },
  "/services": { changeFrequency: "monthly", priority: 0.9 },
  "/free-audit": { changeFrequency: "monthly", priority: 0.8 },
  "/contact": { changeFrequency: "yearly", priority: 0.8 },
  "/relief-os": { changeFrequency: "monthly", priority: 0.8 },
  "/dartx": { changeFrequency: "monthly", priority: 0.8 },
  "/portfolio": { changeFrequency: "weekly", priority: 0.8 },
  "/about": { changeFrequency: "monthly", priority: 0.7 },
  "/privacy-policy": { changeFrequency: "yearly", priority: 0.3 },
  "/terms-of-service": { changeFrequency: "yearly", priority: 0.3 },
};

function routeFromDirectory(directory: string, appRoot: string): string {
  const relative = path.relative(appRoot, directory);
  if (!relative) return "/";

  const segments = relative
    .split(path.sep)
    // Route groups do not appear in the public URL.
    .filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")));

  return `/${segments.join("/")}`;
}

function getStaticRoutes(): string[] {
  const appRoot = path.join(process.cwd(), APP_DIR);
  const routes = new Set<string>();

  function walk(directory: string) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (entry.name.startsWith("_") || entry.name === "api") continue;
      walk(path.join(directory, entry.name));
    }

    const hasPage = ["page.tsx", "page.ts", "page.jsx", "page.js"].some((name) =>
      fs.existsSync(path.join(directory, name)),
    );

    if (!hasPage) return;

    const route = routeFromDirectory(directory, appRoot);
    // Dynamic segments are populated below from the same data sources the pages use.
    if (route.includes("[")) return;
    if (EXCLUDE.has(route)) return;
    routes.add(route);
  }

  walk(appRoot);
  return [...routes];
}

function settingsFor(route: string): RouteSettings {
  if (route.startsWith("/services/")) {
    return { changeFrequency: "monthly", priority: 0.9 };
  }
  if (route.startsWith("/portfolio/")) {
    return { changeFrequency: "yearly", priority: 0.6 };
  }
  return ROUTE_SETTINGS[route] ?? { changeFrequency: "monthly", priority: 0.7 };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = new Set(getStaticRoutes());

  // Same source of truth used by the Services and Portfolio pages, so new entries
  // automatically appear in the sitemap without maintaining a second slug list.
  for (const service of SERVICES) routes.add(`/services/${service.slug}`);
  for (const study of CASE_STUDIES) routes.add(`/portfolio/${study.slug}`);

  const orderedRoutes = [
    "/",
    "/services",
    ...SERVICES.map((service) => `/services/${service.slug}`),
    "/free-audit",
    "/contact",
    "/relief-os",
    "/dartx",
    "/portfolio",
    ...CASE_STUDIES.map((study) => `/portfolio/${study.slug}`),
    "/about",
    "/privacy-policy",
    "/terms-of-service",
  ].filter((route) => routes.has(route) && !EXCLUDE.has(route));

  return orderedRoutes.map((route) => {
    const { changeFrequency, priority } = settingsFor(route);
    return {
      url: `${BASE_URL}${route === "/" ? "" : route}`,
      changeFrequency,
      priority,
    };
  });
}
