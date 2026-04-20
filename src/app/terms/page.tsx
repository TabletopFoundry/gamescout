import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — GameScout",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
      <div className="prose prose-invert prose-sm max-w-none space-y-4 text-zinc-300">
        <p>
          GameScout is a demo/portfolio project. By using this application, you
          agree to the following terms.
        </p>
        <h2 className="text-xl font-semibold text-white mt-8">
          Use of Service
        </h2>
        <p>
          GameScout is provided as-is for demonstration purposes. We make no
          guarantees about the availability, accuracy, or completeness of data
          displayed in the application.
        </p>
        <h2 className="text-xl font-semibold text-white mt-8">
          Pricing Information
        </h2>
        <p>
          Prices shown are for informational purposes only and may not reflect
          current retailer pricing. Always verify prices on the retailer&apos;s
          website before purchasing.
        </p>
        <h2 className="text-xl font-semibold text-white mt-8">
          Affiliate Disclosure
        </h2>
        <p>
          Some links on GameScout may be affiliate links. We may earn a
          commission when you click on or make purchases via these links.
        </p>
        <h2 className="text-xl font-semibold text-white mt-8">
          User Content
        </h2>
        <p>
          Reviews, ratings, and other content you submit remain associated with
          your browser session. We reserve the right to remove any content that
          violates these terms.
        </p>
      </div>
    </div>
  );
}
