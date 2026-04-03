const badgeStyles = {
  Guardian: "bg-purple-100 text-purple-800",
  Knight:   "bg-blue-100 text-blue-800",
  Expert:   "bg-green-100 text-green-800",
  Novice:   "bg-gray-100 text-gray-700",
};

export default function BadgePill({ badge }) {
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${badgeStyles[badge] ?? badgeStyles.Novice}`}>
      {badge}
    </span>
  );
}