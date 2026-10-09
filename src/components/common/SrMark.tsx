import React from "react";

/**
 * SR monogram: a geometric, stroke-built "S" (blue→cyan gradient) next to an "R"
 * (white) on a deep-navy rounded square. Pure SVG, so it works in React and in
 * next/og ImageResponse (favicons).
 */
export function SrMark({
  size = 40,
  rounded = true,
  idSuffix = "",
}: {
  size?: number | string;
  rounded?: boolean;
  idSuffix?: string;
}) {
  const bg = `srBg${idSuffix}`;
  const grad = `srGrad${idSuffix}`;
  const shine = `srShine${idSuffix}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="SR logo"
    >
      <defs>
        <linearGradient id={bg} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#121c33" />
          <stop offset="1" stopColor="#060a14" />
        </linearGradient>
        <linearGradient id={grad} x1="20" y1="26" x2="48" y2="74" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#1683ff" />
        </linearGradient>
        <linearGradient id={shine} x1="0" y1="0" x2="0" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx={rounded ? 24 : 0} fill={`url(#${bg})`} />
      <rect width="100" height="50" rx={rounded ? 24 : 0} fill={`url(#${shine})`} />
      {/* S */}
      <path
        d="M46 37C45 31 40 28 33.5 28C26.5 28 22 31.5 22 37C22 43 27 45 33.5 48C40 51 46 53.500 46 60.500C46 67 40.500 72 33.500 72C26.500 72 22 68.500 21 63"
        stroke={`url(#${grad})`}
        strokeWidth="7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* R */}
      <path
        d="M57 72V28H68C75.500 28 80 32.500 80 39C80 45.500 75.500 50 68 50H57M68 50L81 72"
        stroke="#ffffff"
        strokeWidth="7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* accent dot */}
      <circle cx="82" cy="24" r="3.5" fill="#22d3ee" />
    </svg>
  );
}

export default SrMark;
