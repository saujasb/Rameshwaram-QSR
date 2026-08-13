// Original mark for this internal tool — not the café's real trademark (none was
// available in the project), designed to evoke a kolam dot-grid without copying one.
export function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
      <circle cx="20" cy="20" r="19" fill="#B65F3A" />
      <circle cx="20" cy="20" r="19" fill="url(#brandmark-sheen)" />
      <g stroke="#F7F3EC" strokeWidth="1.15" strokeLinecap="round" opacity="0.92">
        <path d="M20 8 L20 32" />
        <path d="M8 20 L32 20" />
        <path d="M11.5 11.5 L28.5 28.5" />
        <path d="M28.5 11.5 L11.5 28.5" />
      </g>
      <circle cx="20" cy="20" r="4.5" fill="#F7F3EC" />
      <circle cx="20" cy="20" r="4.5" fill="none" stroke="#C8A45D" strokeWidth="1" />
      {[8, 32].map((x) => (
        <circle key={`h${x}`} cx={x} cy={20} r="1.6" fill="#C8A45D" />
      ))}
      {[8, 32].map((y) => (
        <circle key={`v${y}`} cx={20} cy={y} r="1.6" fill="#C8A45D" />
      ))}
      {[[11.5, 11.5], [28.5, 11.5], [11.5, 28.5], [28.5, 28.5]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="#C8A45D" />
      ))}
      <defs>
        <radialGradient id="brandmark-sheen" cx="30%" cy="22%" r="75%">
          <stop offset="0%" stopColor="#D9953D" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#B65F3A" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
