import type { Stats as StatsData } from "@/domain";

interface Props {
  stats: StatsData;
}

export function Stats({ stats }: Props) {
  const successLabel =
    stats.successRate === null
      ? "—"
      : `${Math.round(stats.successRate * 100)}%`;

  return (
    <div className="panel">
      <h2>Statistics</h2>
      <div className="stats-grid">
        <StatCard label="Total cards" value={String(stats.totalCards)} />
        <StatCard label="Learned today" value={String(stats.learnedToday)} />
        <StatCard label="Success rate" value={successLabel} />
        <StatCard label="Reviews today" value={String(stats.reviewsToday)} />
      </div>
      {stats.successRate !== null && (
        <div className="progress" aria-hidden>
          <div
            className="progress__bar"
            style={{ width: `${Math.round(stats.successRate * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <span className="stat__value">{value}</span>
      <span className="stat__label">{label}</span>
    </div>
  );
}
