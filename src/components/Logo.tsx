// The site mark: the five-layer stack seen from above. Same drawing as public/favicon.svg, but coloured
// from the theme variables so it follows light and dark mode.
export function Logo({ size = 30 }: { size?: number }) {
  const slab = (i: number) => {
    const y = 21 + i * 6.2;
    return <polygon key={i} points={`11,${y} 32,${y - 10} 53,${y} 32,${y + 10}`} fill={i === 0 ? "var(--l0)" : "var(--bg-1)"} stroke={`var(--l${i})`} strokeWidth={2.8} strokeLinejoin="round" />;
  };
  return (
    <svg className="logo" viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <rect width="64" height="64" rx="15" fill="var(--bg-1)" stroke="var(--line-2)" />
      {[4, 3, 2, 1, 0].map(slab)}
    </svg>
  );
}
