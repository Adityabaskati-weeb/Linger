interface HealthScoreProps {
  score: number;
}

export function HealthScore({ score }: HealthScoreProps) {
  return (
    <div className="relative grid h-40 w-40 place-items-center rounded-full border border-primary/30 bg-primary/10 shadow-glow">
      <div
        className="absolute inset-3 rounded-full"
        style={{
          background: `conic-gradient(#06B6D4 ${score * 3.6}deg, rgba(255,255,255,0.08) 0deg)`
        }}
      />
      <div className="relative grid h-28 w-28 place-items-center rounded-full bg-elevated">
        <span className="font-display text-5xl font-semibold">{score}</span>
      </div>
    </div>
  );
}
