"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#34d399",
  "#60a5fa",
  "#f472b6",
  "#fbbf24",
  "#a78bfa",
  "#fb923c",
];

const TOOLTIP_STYLE = {
  backgroundColor: "#18181b",
  border: "1px solid #3f3f46",
  borderRadius: "8px",
  color: "#fff",
};

interface StatsChartsProps {
  monthChartData: { month: string; plays: number }[];
  complexityData: { name: string; value: number }[];
  categoryData: { name: string; value: number }[];
  ratedLogs: { name: string; rating: number }[];
}

export default function StatsCharts({
  monthChartData,
  complexityData,
  categoryData,
  ratedLogs,
}: StatsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Plays by Month */}
      {monthChartData.length > 0 && (
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            Plays Per Month
          </h2>
          <div role="img" aria-label={`Bar chart showing plays per month: ${monthChartData.map(d => `${d.month}: ${d.plays}`).join(', ')}`}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="plays" fill="#34d399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          </div>
          <table className="sr-only">
            <caption>Plays per month data</caption>
            <thead><tr><th>Month</th><th>Plays</th></tr></thead>
            <tbody>
              {monthChartData.map(d => (
                <tr key={d.month}><td>{d.month}</td><td>{d.plays}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Complexity Distribution */}
      {complexityData.length > 0 && (
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            Collection by Complexity
          </h2>
          <div role="img" aria-label={`Pie chart showing complexity distribution: ${complexityData.map(d => `${d.name}: ${d.value}`).join(', ')}`}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={complexityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {complexityData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
          </div>
          <table className="sr-only">
            <caption>Collection complexity distribution</caption>
            <thead><tr><th>Complexity</th><th>Count</th></tr></thead>
            <tbody>
              {complexityData.map(d => (
                <tr key={d.name}><td>{d.name}</td><td>{d.value}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Category Distribution */}
      {categoryData.length > 0 && (
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            Top Categories in Collection
          </h2>
          <div role="img" aria-label={`Bar chart showing top categories: ${categoryData.map(d => `${d.name}: ${d.value}`).join(', ')}`}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis
                type="number"
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: "#a1a1aa", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="value" fill="#60a5fa" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
          </div>
          <table className="sr-only">
            <caption>Top categories in collection</caption>
            <thead><tr><th>Category</th><th>Count</th></tr></thead>
            <tbody>
              {categoryData.map(d => (
                <tr key={d.name}><td>{d.name}</td><td>{d.value}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recent Ratings */}
      {ratedLogs.length > 0 && (
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            Recent Play Ratings
          </h2>
          <div role="img" aria-label={`Line chart showing recent play ratings: ${ratedLogs.map(d => `${d.name}: ${d.rating}/10`).join(', ')}`}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ratedLogs}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#a1a1aa", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="#fbbf24"
                strokeWidth={2}
                dot={{ fill: "#fbbf24", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          </div>
          <table className="sr-only">
            <caption>Recent play ratings</caption>
            <thead><tr><th>Game</th><th>Rating</th></tr></thead>
            <tbody>
              {ratedLogs.map(d => (
                <tr key={d.name}><td>{d.name}</td><td>{d.rating}/10</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
