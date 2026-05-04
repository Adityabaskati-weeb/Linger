import type { ReactNode } from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { useCountUp } from "../../hooks/useCountUp";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  subtext: string;
  tone?: "success" | "warning" | "danger" | "info" | "neutral";
  icon: ReactNode;
  sparkline?: number[];
}

export function StatCard({
  label,
  value,
  suffix = "",
  subtext,
  tone = "info",
  icon,
  sparkline
}: StatCardProps) {
  const count = useCountUp(value);
  const chartData = sparkline?.map((item, index) => ({ index, item })) ?? [];

  return (
    <Card>
      <div className="mb-5 flex items-center justify-between">
        <Badge tone={tone}>{label}</Badge>
        <div className="text-cyan">{icon}</div>
      </div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-display text-5xl font-semibold">
            {count}
            {suffix}
          </p>
          <p className="mt-2 text-xs text-slate-500">{subtext}</p>
        </div>
        {chartData.length ? (
          <div className="h-12 w-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="item"
                  stroke="var(--accent-secondary)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
