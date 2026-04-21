import Link from "next/link";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

export default function EmptyState({
  icon = "🎲",
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4" aria-hidden="true">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 max-w-sm mb-6">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
