import Link from "next/link";
import { getDb, parseGame, type GameRow, GAME_LIST_COLUMNS } from "@/lib/db";
import TopGamesShowcase from "@/components/TopGamesShowcase";

const HIGHLIGHTS = [
  {
    icon: "🎯",
    title: "Taste Profile Quiz",
    description:
      "Rate 10 well-known games and we'll build a personalized recommendation engine just for you.",
  },
  {
    icon: "🔍",
    title: "Smart Discovery",
    description:
      "Browse by mood — Party Night, Deep Strategy, Cozy Solo — or search 55+ curated titles.",
  },
  {
    icon: "📚",
    title: "Collection Tracker",
    description:
      "Manage your shelf, log plays with scores and notes, and track your game history.",
  },
  {
    icon: "💰",
    title: "Price Comparison",
    description:
      "See current prices across Amazon, Target, and more. Set deal alerts for your wishlist.",
  },
];

export default function HomePage() {
  // Load top 6 games server-side for the showcase
  const db = getDb();
  const topGames = (
    db
      .prepare(`SELECT ${GAME_LIST_COLUMNS} FROM games ORDER BY bgg_rank ASC LIMIT 6`)
      .all() as GameRow[]
  ).map(parseGame);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950 py-24 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(52,211,153,0.1),transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-4 py-1.5 text-sm text-emerald-400 mb-6">
            <span>✨</span>
            <span>Personalized board game discovery</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Find your next
            <span className="block text-emerald-400">favorite game.</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            GameScout recommends board games tailored to your taste. Take a
            quick quiz, browse by mood, track your collection, and discover your
            next obsession.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quiz"
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-lg rounded-xl transition-colors"
            >
              Take the Quiz →
            </Link>
            <Link
              href="/discover"
              className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-lg rounded-xl transition-colors border border-zinc-700"
            >
              Browse Games
            </Link>
          </div>
        </div>
      </section>

      {/* Top Games Showcase */}
      <section className="py-16 px-4 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">
            Top Rated Games
          </h2>
          <p className="text-zinc-400 mb-8">
            Community favorites to get you started
          </p>

          <TopGamesShowcase games={topGames} />
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 px-4 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">
            Everything you need
          </h2>
          <p className="text-zinc-400 text-center mb-12">
            A complete platform for hobbyists and newcomers alike
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HIGHLIGHTS.map((h) => (
              <div
                key={h.title}
                className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <div className="text-3xl mb-3" aria-hidden="true">{h.icon}</div>
                <h3 className="text-white font-semibold mb-2">{h.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {h.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-b from-zinc-950 to-emerald-950/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to scout your next game?
          </h2>
          <p className="text-zinc-400 mb-8 text-lg">
            Takes less than 5 minutes to build your taste profile and get
            personalized recommendations.
          </p>
          <Link
            href="/quiz"
            className="inline-block px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-lg rounded-xl transition-colors"
          >
            Start Your Taste Profile
          </Link>
        </div>
      </section>
    </div>
  );
}
