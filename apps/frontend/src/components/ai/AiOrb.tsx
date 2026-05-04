interface AiOrbProps {
  state: "idle" | "listening" | "processing" | "speaking";
}

export function AiOrb({ state }: AiOrbProps) {
  const color =
    state === "listening"
      ? "rgba(16,185,129,0.78)"
      : state === "speaking"
        ? "rgba(6,182,212,0.82)"
        : "rgba(99,102,241,0.78)";

  return (
    <div className="relative grid h-72 w-72 place-items-center">
      <div
        className="absolute inset-0 rounded-full border"
        style={{
          borderColor: color,
          boxShadow: `0 0 48px ${color}`,
          animation: state === "processing" ? "orb-thinking 2s linear infinite" : "orb-idle 3s ease-in-out infinite"
        }}
      />
      <div className="absolute inset-8 rounded-full border border-white/10 bg-white/[0.03]" />
      <div className="relative h-40 w-40 rounded-full bg-gradient-to-br from-primary via-cyan to-success shadow-glow" />
    </div>
  );
}
