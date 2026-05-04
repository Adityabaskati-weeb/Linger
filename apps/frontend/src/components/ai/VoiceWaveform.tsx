interface VoiceWaveformProps {
  active: boolean;
}

export function VoiceWaveform({ active }: VoiceWaveformProps) {
  return (
    <div className="flex h-16 items-center justify-center gap-1.5">
      {Array.from({ length: 18 }, (_, index) => (
        <span
          key={index}
          className="h-10 w-1.5 rounded-full bg-cyan"
          style={{
            opacity: active ? 0.9 : 0.25,
            animation: active ? `waveform ${0.75 + (index % 5) * 0.08}s ease-in-out infinite` : undefined,
            animationDelay: `${index * 0.04}s`
          }}
        />
      ))}
    </div>
  );
}
