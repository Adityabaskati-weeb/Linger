interface AttendanceHeatmapProps {
  data: number[][];
}

export function AttendanceHeatmap({ data }: AttendanceHeatmapProps) {
  return (
    <div className="grid gap-1">
      {data.map((row, rowIndex) => (
        <div key={rowIndex} className="grid gap-1" style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}>
          {row.map((value, hour) => (
            <div
              key={`${rowIndex}-${hour}`}
              title={`Day ${rowIndex + 1}, ${hour}:00 - ${value} AI sessions`}
              className="h-3 rounded-sm bg-cyan"
              style={{ opacity: Math.max(0.12, value / 20) }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
