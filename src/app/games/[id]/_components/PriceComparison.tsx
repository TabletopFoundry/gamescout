"use client";

import type { DealInfo, PriceInfo } from "@/types";

interface PriceComparisonProps {
  prices: PriceInfo[];
  deals: DealInfo[];
  showAlertForm: boolean;
  alertSet: boolean;
  alertPrice: string;
  alertEmail: string;
  alertSubmitting: boolean;
  onAlertPriceChange: (value: string) => void;
  onAlertEmailChange: (value: string) => void;
  onSubmitAlert: () => void;
  onShowAlertForm: () => void;
  onCancelAlert: () => void;
}

export function PriceComparison({
  prices,
  deals,
  showAlertForm,
  alertSet,
  alertPrice,
  alertEmail,
  alertSubmitting,
  onAlertPriceChange,
  onAlertEmailChange,
  onSubmitAlert,
  onShowAlertForm,
  onCancelAlert,
}: PriceComparisonProps) {
  const lowestPrice =
    prices.length > 0 ? prices.reduce((a, b) => (a.price < b.price ? a : b)) : null;

  return (
    <section className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Price Comparison</h2>
        <p className="text-xs text-zinc-500">
          * Prices are informational. We may earn affiliate commission.
        </p>
      </div>

      {prices.length > 0 ? (
        <>
          <div className="space-y-3 mb-4">
            {prices.map((p) => (
              <div
                key={p.id}
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-xl border ${
                  lowestPrice?.id === p.id
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-zinc-800 bg-zinc-800/50"
                }`}
              >
                <div className="flex items-center gap-3 flex-wrap">
                  {lowestPrice?.id === p.id && (
                    <span className="text-xs bg-emerald-500 text-black font-bold px-2 py-0.5 rounded-full">
                      Best Price
                    </span>
                  )}
                  <span className="text-white font-medium">{p.retailer}</span>
                  <span className="text-xs text-zinc-500">
                    Updated {new Date(p.updated_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-white">
                    ${p.price.toFixed(2)}
                  </span>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded-lg transition-colors"
                  >
                    Buy →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {deals.length > 0 && (
            <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-300">
                Active Deals
              </h3>
              <div className="space-y-3">
                {deals.map((deal) => (
                  <div key={deal.id} className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-950/40 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        {deal.featured === 1 && (
                          <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
                            Featured
                          </span>
                        )}
                        <span className="font-medium text-white">{deal.title}</span>
                        <span className="text-xs text-zinc-500">{deal.retailer}</span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-400">
                        Save {deal.discount_pct}% until {new Date(deal.ends_at).toLocaleDateString()}
                        {deal.coupon_code ? ` · Code ${deal.coupon_code}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm text-zinc-500 line-through">${deal.msrp.toFixed(2)}</p>
                        <p className="text-lg font-bold text-amber-300">${deal.sale_price.toFixed(2)}</p>
                      </div>
                      {deal.url && (
                        <a
                          href={deal.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-amber-300"
                        >
                          View deal →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deal Alert */}
          {!alertSet && !showAlertForm && (
            <button
              onClick={onShowAlertForm}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              🔔 Set a deal alert
            </button>
          )}
          {alertSet && (
            <p className="text-sm text-emerald-400">
              ✓ Deal alert set! We&apos;ll notify you when the price drops.
            </p>
          )}
          {showAlertForm && (
            <div className="mt-4 bg-zinc-800 rounded-xl p-4 border border-zinc-700">
              <h3 className="text-sm font-semibold text-white mb-3">
                Set Deal Alert
              </h3>
              <div className="flex gap-3 flex-wrap">
                <input
                  type="number"
                  value={alertPrice}
                  onChange={(e) => onAlertPriceChange(e.target.value)}
                  placeholder="Target price ($)"
                  min={0.01}
                  step={0.01}
                  inputMode="decimal"
                  aria-label="Target price in dollars"
                  className="bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm flex-1 min-w-0"
                />
                <input
                  type="email"
                  value={alertEmail}
                  onChange={(e) => onAlertEmailChange(e.target.value)}
                  placeholder="Email (optional)"
                  autoComplete="email"
                  aria-label="Notification email (optional)"
                  className="bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm flex-1 min-w-0"
                />
                <button
                  onClick={onSubmitAlert}
                  disabled={!alertPrice || alertSubmitting}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold text-sm rounded-lg transition-colors"
                >
                  {alertSubmitting ? "..." : "Set Alert"}
                </button>
                <button
                  onClick={onCancelAlert}
                  className="px-3 py-2 text-zinc-400 hover:text-white text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-zinc-500 text-sm">
          No pricing data available for this title.
        </p>
      )}
    </section>
  );
}
