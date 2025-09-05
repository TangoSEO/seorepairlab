export type Service = {
  slug: string;
  title: string;
  path: string;
  description: string;
};

export const services: Service[] = [
  {
    slug: "programmatic-seo",
    title: "Programmatic SEO",
    path: "/services/programmatic-seo/",
    description:
      "Scale hundreds of high‑quality, templated pages from your data to capture long‑tail demand with consistent structure, internal linking, and schema.",
  },
  {
    slug: "google-indexation-issues",
    title: "Google Indexation Issues",
    path: "/services/google-indexation-issues/",
    description:
      "Diagnose and fix crawling and indexing blockers: robots.txt, noindex, canonical conflicts, and crawl budget misallocation.",
  },
  {
    slug: "index-bloat-solutions",
    title: "Index Bloat Solutions",
    path: "/services/index-bloat-solutions/",
    description:
      "Remove thin/duplicate/parameter pages to concentrate authority, improve crawl efficiency, and stabilize rankings.",
  },
  {
    slug: "server-performance-optimization",
    title: "Server & Performance Optimization",
    path: "/services/server-performance-optimization/",
    description:
      "Resolve 5xx/redirect chains, speed up TTFB, and improve Core Web Vitals to support better visibility.",
  },
  {
    slug: "site-architecture-analysis",
    title: "Site Architecture Analysis",
    path: "/services/site-architecture-analysis/",
    description:
      "Optimize URL structure, internal linking, breadcrumbs, and schema to strengthen topical discoverability.",
  },
];

