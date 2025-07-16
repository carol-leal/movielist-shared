export default function Rating({ rating }: { rating: number }) {
  const percentage = Math.round(rating * 10);
  const radius = 20;
  const stroke = 4;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 15,
        right: 15,
        width: 42,
        height: 42,
        backgroundColor: "black",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
        zIndex: 2,
      }}
    >
      <svg width="42" height="42" viewBox="0 0 50 50">
        {/* Background circle */}
        <circle
          stroke="#2e2e2e"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx="25"
          cy="25"
        />
        {/* Progress circle */}
        <circle
          stroke="#00FF94"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{
            strokeDashoffset,
            transition: "stroke-dashoffset 0.35s",
          }}
          r={normalizedRadius}
          cx="25"
          cy="25"
          transform="rotate(-90 25 25)"
        />
        {/* Text */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="14"
          fontWeight="bold"
          fill="white"
        >
          {percentage}
          <tspan dy="-4" dx="1" fontSize="9">
            %
          </tspan>
        </text>
      </svg>
    </div>
  );
}
