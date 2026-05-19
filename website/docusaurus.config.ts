import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { themes as prismThemes } from "prism-react-renderer";

const GITHUB_URL = "https://github.com/TabletopFoundry/gamescout";

const config: Config = {
  title: "GameScout",
  tagline:
    "Discover your next favorite board game — personalized recommendations, mood-based browsing, collection tracking, and price comparison.",
  favicon: "img/favicon.svg",

  future: {
    v4: true,
  },

  url: "https://tabletopfoundry.github.io",
  baseUrl: "/gamescout/",

  organizationName: "TabletopFoundry",
  projectName: "gamescout",

  onBrokenLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },
  themes: [
    "@docusaurus/theme-mermaid",
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        docsRouteBasePath: "/",
        indexBlog: false,
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "/",
          editUrl: `${GITHUB_URL}/tree/main/website/`,
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/social-card.svg",
    colorMode: {
      defaultMode: "dark",
      respectPrefersColorScheme: false,
    },
    metadata: [
      {
        name: "keywords",
        content:
          "board games, recommendations, BGG, board game tracker, board game collection, taste profile, price tracker",
      },
      { name: "og:type", content: "website" },
    ],
    navbar: {
      title: "GameScout",
      logo: {
        alt: "GameScout logo",
        src: "img/logo.svg",
      },
      items: [
        {
          to: "/getting-started/quick-start",
          label: "Get Started",
          position: "left",
        },
        { to: "/concepts/overview", label: "Concepts", position: "left" },
        { to: "/guides/discovery", label: "Guides", position: "left" },
        { to: "/reference/api", label: "API", position: "left" },
        { to: "/why", label: "Why GameScout", position: "left" },
        {
          href: GITHUB_URL,
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            { label: "Quick Start", to: "/getting-started/quick-start" },
            { label: "Core Concepts", to: "/concepts/overview" },
            { label: "API Reference", to: "/reference/api" },
            { label: "Troubleshooting", to: "/troubleshooting" },
          ],
        },
        {
          title: "Project",
          items: [
            { label: "Why GameScout", to: "/why" },
            { label: "Contributing", to: "/contributing" },
            { label: "Changelog", to: "/changelog" },
          ],
        },
        {
          title: "Community",
          items: [
            { label: "GitHub", href: GITHUB_URL },
            { label: "Issues", href: `${GITHUB_URL}/issues` },
            { label: "Discussions", href: `${GITHUB_URL}/discussions` },
          ],
        },
      ],
      copyright: `MIT licensed. Built with Docusaurus. Board game data inspired by the BoardGameGeek community.`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ["bash", "json", "typescript", "tsx", "sql"],
    },
    mermaid: {
      theme: { light: "neutral", dark: "dark" },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
