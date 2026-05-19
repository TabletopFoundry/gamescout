import { useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import CodeBlock from "@theme/CodeBlock";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";

const INSTALL_CMD = "git clone https://github.com/TabletopFoundry/gamescout && cd gamescout && npm install && npm run dev";

const features = [
  {
    icon: "🎯",
    title: "Taste Profile Quiz",
    body: "Rate 10 well-known games and answer a few preference questions. GameScout builds a profile that drives every recommendation.",
  },
  {
    icon: "🤖",
    title: "Personalized Recommendations",
    body: "A transparent content-based engine scores every game on complexity, theme, mechanics, player count, and BGG rating — and tells you why.",
  },
  {
    icon: "🎭",
    title: "Mood-Based Discovery",
    body: "Browse by Quick Party, Deep Strategy, Cozy Two-Player, Solo Evening, and more. Filters run in SQL — instant results.",
  },
  {
    icon: "📚",
    title: "Collection & Play Log",
    body: "Track owned games and wishlist, log plays with winners and scores, and watch your stats dashboard come to life.",
  },
  {
    icon: "💰",
    title: "Price Tracker",
    body: "Compare retailer snapshots, surface active deals, and set alerts for the price you want to pay.",
  },
];

function CopyableCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard not available
    }
  }

  return (
    <div className={styles.installBlock}>
      <code>$ {command}</code>
      <button className={styles.copyBtn} onClick={copy} aria-label="Copy install command">
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export default function Home(): React.ReactElement {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}
    >
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Open source · Next.js 16 · SQLite</span>
          <h1 className={styles.title}>
            Discover your next favorite <span>board game</span>.
          </h1>
          <p className={styles.subtitle}>
            GameScout is a self-hosted board game discovery and collection tracker.
            Personalized recommendations, mood-based browsing, price comparison, and a
            stats dashboard — all running locally with a single command.
          </p>
          <div className={styles.ctas}>
            <Link className="button button--primary button--lg" to="/getting-started/quick-start">
              Get Started → 5 minutes
            </Link>
            <Link
              className="button button--secondary button--lg"
              href="https://github.com/TabletopFoundry/gamescout"
            >
              View on GitHub
            </Link>
          </div>
          <CopyableCommand command={INSTALL_CMD} />
        </div>
      </header>

      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2>Everything you need to find your next great game</h2>
          <p>
            One app, five workflows. Start from a quiz, end with a play log and a price alert.
          </p>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <span className={styles.featureIcon} aria-hidden>
                {f.icon}
              </span>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureBody}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.snippet}>
        <div className={styles.snippetInner}>
          <div className={styles.snippetCopy}>
            <h3>Recommendations you can actually inspect</h3>
            <p>
              No opaque ML model. The scoring engine is one TypeScript file you can
              read in five minutes — and every recommendation comes with a human-readable reason.
            </p>
            <ul>
              <li>Complexity match (±15 pts per unit distance)</li>
              <li>Category & mechanic overlap with games you loved</li>
              <li>BGG rating, player count, duration fit</li>
              <li>Similarity to your highly-rated titles</li>
            </ul>
            <Link to="/concepts/recommendation-engine">Read the algorithm →</Link>
          </div>
          <CodeBlock language="typescript">{`// src/lib/recommendations.ts (excerpt)
score += 15 - Math.abs(game.complexity - profile.preferredComplexity) * 15;

for (const cat of game.categories) {
  if (profile.lovedCategories.has(cat)) score += 15;
}

for (const mech of game.mechanics) {
  if (profile.lovedMechanics.has(mech)) score += 10;
}

score += Math.min(20, game.bgg_rating * 2.5);
`}</CodeBlock>
        </div>
      </section>
    </Layout>
  );
}
