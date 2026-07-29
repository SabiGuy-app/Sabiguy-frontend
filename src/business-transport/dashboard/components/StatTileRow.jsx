import StatTile from "./StatTile";

export default function StatTileRow({ stats = [] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
      {stats.map((stat) => (
        <StatTile key={stat.id || stat.label} {...stat} />
      ))}
    </div>
  );
}
