'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { useAppointments } from '@/hooks/useAppointments';
import { cn } from '@/lib/utils';

type Range = 'week' | 'month' | 'year';

const LABELS: Record<Range, string[]> = {
  week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  month: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
  year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

const MOCK: Record<Range, { accepted: number[]; pending: number[]; rejected: number[] }> = {
  week: {
    accepted: [5, 8, 4, 10, 7, 3, 1],
    pending: [2, 3, 2, 4, 2, 1, 0],
    rejected: [1, 1, 0, 2, 1, 0, 0],
  },
  month: {
    accepted: [22, 31, 18, 28],
    pending: [8, 12, 6, 10],
    rejected: [3, 4, 2, 5],
  },
  year: {
    accepted: [40, 35, 50, 60, 55, 70, 65, 80, 72, 68, 55, 90],
    pending: [10, 12, 8, 15, 11, 14, 12, 18, 16, 14, 10, 20],
    rejected: [4, 3, 5, 6, 4, 7, 5, 8, 7, 6, 4, 9],
  },
};

const COLORS = {
  accepted: 'oklch(0.62 0.14 145)',   // soft green (keep)
  pending: 'oklch(0.78 0.14 85)',     // warm amber (perfect)
  rejected: 'oklch(0.58 0.18 25)',    // warm red (keep)
};

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value ?? 0), 0);
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 text-xs shadow-md space-y-1 min-w-[130px]">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-muted-foreground capitalize">
            <span className="w-2 h-2 rounded-sm inline-block" style={{ background: COLORS[p.dataKey as keyof typeof COLORS] }} />
            {p.dataKey}
          </span>
          <span className="font-medium text-foreground">{p.value}</span>
        </div>
      ))}
      <div className="border-t border-border pt-1 mt-1 flex justify-between">
        <span className="text-muted-foreground">Total</span>
        <span className="font-semibold text-foreground">{total}</span>
      </div>
    </div>
  );
}

function StatPill({ label, value, className }: { label: string; value: number; className?: string }) {
  return (
    <div className="flex-1 min-w-0 bg-muted/40 rounded-xl px-3 py-2.5">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className={cn('text-xl font-semibold mt-0.5 tabular-nums', className)}>{value}</p>
    </div>
  );
}

const RANGES: { key: Range; label: string }[] = [
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
];

export function StatusChart() {
  const { currentDoctor } = useAuth();
  const { getStats } = useAppointments();
  const [range, setRange] = useState<Range>('week');

  const liveStats = currentDoctor ? getStats(currentDoctor.id) : null;

  const chartData = useMemo(() =>
    LABELS[range].map((label, i) => ({
      label,
      accepted: MOCK[range].accepted[i] ?? 0,
      pending: MOCK[range].pending[i] ?? 0,
      rejected: MOCK[range].rejected[i] ?? 0,
    })),
    [range]);

  const totals = useMemo(() => {
    const acc = chartData.reduce((s, r) => s + r.accepted, 0);
    const pend = chartData.reduce((s, r) => s + r.pending, 0);
    const rej = chartData.reduce((s, r) => s + r.rejected, 0);
    return { acc, pend, rej, total: acc + pend + rej };
  }, [chartData]);

  const acceptanceRate = totals.total > 0
    ? Math.round((totals.acc / totals.total) * 100)
    : 0;

  const hasData = liveStats
    ? (liveStats.accepted + liveStats.pending + liveStats.rejected) > 0
    : totals.total > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      className="bg-card border border-border rounded-2xl p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-semibold text-foreground">Appointment status</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {range === 'week' ? 'Daily' : range === 'month' ? 'Weekly' : 'Monthly'} breakdown
          </p>
        </div>
        <div className="flex gap-1.5 bg-muted/50 p-1 rounded-lg">
          {RANGES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setRange(key)}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-all',
                range === key
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat pills */}
      <div className="flex gap-2">
        <StatPill label="Total" value={liveStats ? (liveStats.accepted + liveStats.pending + liveStats.rejected) : totals.total} className="text-foreground" />
        <StatPill label="Accepted" value={liveStats?.accepted ?? totals.acc} className="text-success" />
        <StatPill label="Pending" value={liveStats?.pending ?? totals.pend} className="text-warning-foreground" />
        <StatPill label="Rejected" value={liveStats?.rejected ?? totals.rej} className="text-destructive" />
      </div>

      {/* Chart */}
      {!hasData ? (
        <div className="h-52 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">No data available</p>
        </div>
      ) : (
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              key={range}
              data={chartData}
              barCategoryGap="30%"
              barGap={3}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'var(--muted)', opacity: 0.35, radius: 4 }}
              />
              <Bar dataKey="accepted" radius={[4, 4, 0, 0]} maxBarSize={28} fill={COLORS.accepted} />
              <Bar dataKey="pending" radius={[4, 4, 0, 0]} maxBarSize={28} fill={COLORS.pending} />
              <Bar dataKey="rejected" radius={[4, 4, 0, 0]} maxBarSize={28} fill={COLORS.rejected} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Footer legend + acceptance rate */}
      <div className="flex items-center justify-between pt-1 border-t border-border flex-wrap gap-2">
        <div className="flex gap-4">
          {Object.entries(COLORS).map(([key, color]) => (
            <span key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground capitalize">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: color }} />
              {key}
            </span>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          Acceptance rate:{' '}
          <span className="font-semibold text-foreground">{acceptanceRate}%</span>
        </span>
      </div>
    </motion.div>
  );
}