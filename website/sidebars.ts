import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: "category",
      label: "Getting Started",
      collapsed: false,
      items: [
        "getting-started/quick-start",
        "getting-started/installation",
        "getting-started/first-recommendations",
      ],
    },
    {
      type: "category",
      label: "Core Concepts",
      items: [
        "concepts/overview",
        "concepts/taste-profile",
        "concepts/recommendation-engine",
        "concepts/moods",
        "concepts/sessions-and-users",
        "concepts/seed-data",
      ],
    },
    {
      type: "category",
      label: "Guides",
      items: [
        "guides/discovery",
        "guides/collection-and-wishlist",
        "guides/play-logging",
        "guides/price-tracking",
        "guides/reviews",
        "guides/deploying",
      ],
    },
    {
      type: "category",
      label: "Reference",
      items: [
        "reference/api",
        "reference/configuration",
        "reference/database-schema",
        "reference/scripts",
      ],
    },
    "why",
    "troubleshooting",
    "contributing",
    "changelog",
  ],
};

export default sidebars;
