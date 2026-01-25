export function LogoBTTMark(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 451 501"
      {...props}
    >
      <g fill="currentColor">
        <rect x="100.5" y="0.5" width="100" height="100" />
        <rect x="200.5" y="0.5" width="100" height="100" />
        <rect x="300.5" y="0.5" width="100" height="100" />
        <rect x="350.5" y="100.5" width="100" height="100" />
        <rect x="300.5" y="175.5" width="50" height="50" />
        <rect x="200.5" y="225.5" width="50" height="50" />
        <rect x="250.5" y="225.5" width="50" height="50" />
        <rect x="300.5" y="225.5" width="50" height="50" />
        <rect x="300.5" y="275.5" width="50" height="50" />
        <rect x="350.5" y="300.5" width="100" height="100" />
        <rect x="200.5" y="400.5" width="100" height="100" />
        <rect x="300.5" y="400.5" width="100" height="100" />
        <rect x="100.5" y="400.5" width="100" height="100" />
      </g>
    </svg>
  );
}

export function getMarkSVG(color: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 451 501"><g fill="${color}"><rect x="100.5" y="0.5" width="100" height="100"/><rect x="200.5" y="0.5" width="100" height="100"/><rect x="300.5" y="0.5" width="100" height="100"/><rect x="350.5" y="100.5" width="100" height="100"/><rect x="300.5" y="175.5" width="50" height="50"/><rect x="200.5" y="225.5" width="50" height="50"/><rect x="250.5" y="225.5" width="50" height="50"/><rect x="300.5" y="225.5" width="50" height="50"/><rect x="300.5" y="275.5" width="50" height="50"/><rect x="350.5" y="300.5" width="100" height="100"/><rect x="200.5" y="400.5" width="100" height="100"/><rect x="300.5" y="400.5" width="100" height="100"/><rect x="100.5" y="400.5" width="100" height="100"/></g></svg>`;
}
