import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — GameScout",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
      <div className="prose prose-invert prose-sm max-w-none space-y-4 text-zinc-300">
        <p>
          GameScout is a demo application. This privacy policy outlines how we
          handle your information.
        </p>
        <h2 className="text-xl font-semibold text-white mt-8">
          Data We Collect
        </h2>
        <p>
          GameScout stores your taste quiz responses, collection data, play
          logs, and reviews locally in a SQLite database. We use a session
          cookie to identify your browser session — no personal information
          (name, email, etc.) is required.
        </p>
        <h2 className="text-xl font-semibold text-white mt-8">
          Cookies
        </h2>
        <p>
          We use a single HTTP-only cookie (<code>gs_session</code>) to
          maintain your session. This cookie contains only an opaque session
          token and no personally identifiable information.
        </p>
        <h2 className="text-xl font-semibold text-white mt-8">
          Affiliate Links
        </h2>
        <p>
          Price comparison links may contain affiliate codes. We may earn a
          commission on purchases made through these links at no additional
          cost to you.
        </p>
        <h2 className="text-xl font-semibold text-white mt-8">Contact</h2>
        <p>
          For questions about this policy, please open an issue on our GitHub
          repository.
        </p>
      </div>
    </div>
  );
}
