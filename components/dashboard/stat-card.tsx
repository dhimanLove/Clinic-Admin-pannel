'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  sparkline?: number[];
  progress?: number;
  progressLabel?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'destructive';
  index?: number;
  onClick?: () => void;
}

const variantStyles = {
  default: {
    icon: 'bg-muted text-muted-foreground',
    value: 'text-foreground',
    sparkStroke: 'var(--color-muted-foreground)',
    sparkFill: 'var(--color-muted-foreground)',
    progressBar: 'bg-foreground/20',
    trendPos: 'bg-muted text-foreground',
    trendNeg: 'bg-destructive/10 text-destructive',
  },
  primary: {
    icon: 'bg-primary/10 text-primary',
    value: 'text-primary',
    sparkStroke: 'var(--color-primary)',
    sparkFill: 'var(--color-primary)',
    progressBar: 'bg-primary/25',
    trendPos: 'bg-primary/10 text-primary',
    trendNeg: 'bg-destructive/10 text-destructive',
  },
  secondary: {
    icon: 'bg-secondary text-secondary-foreground',
    value: 'text-foreground',
    sparkStroke: 'var(--color-muted-foreground)',
    sparkFill: 'var(--color-muted-foreground)',
    progressBar: 'bg-foreground/15',
    trendPos: 'bg-muted text-foreground',
    trendNeg: 'bg-destructive/10 text-destructive',
  },
  success: {
    icon: 'bg-success/10 text-success',
    value: 'text-success',
    sparkStroke: 'var(--color-success)',
    sparkFill: 'var(--color-success)',
    progressBar: 'bg-success/25',
    trendPos: 'bg-success/10 text-success',
    trendNeg: 'bg-destructive/10 text-destructive',
  },
  warning: {
    icon: 'bg-warning/10 text-warning-foreground',
    value: 'text-warning-foreground',
    sparkStroke: 'var(--color-warning)',
    sparkFill: 'var(--color-warning)',
    progressBar: 'bg-warning/25',
    trendPos: 'bg-warning/10 text-warning-foreground',
    trendNeg: 'bg-destructive/10 text-destructive',
  },
  destructive: {
    icon: 'bg-destructive/10 text-destructive',
    value: 'text-destructive',
    sparkStroke: 'var(--color-destructive)',
    sparkFill: 'var(--color-destructive)',
    progressBar: 'bg-destructive/25',
    trendPos: 'bg-muted text-muted-foreground',
    trendNeg: 'bg-destructive/10 text-destructive',
  },
};

/* ── Animated counter ── */
function AnimatedNumber({ to }: { to: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const duration = 600;
    const step = (ts: number) => {
      if (!start) start = ts;
      const pct = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      setDisplay(Math.round(ease * to));
      if (pct < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to]);
  return <>{display}</>;
}

/* ── Mini sparkline SVG ── */
function Sparkline({ data, stroke, fill }: { data: number[]; stroke: string; fill: string }) {
  if (data.length < 2) return null;
  const W = 64, H = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const line = pts.join(' ');
  const area = `0,${H} ${line} ${W},${H}`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" className="overflow-visible">
      <polygon points={area} fill={fill} opacity={0.1} />
      <polyline
        points={line}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.5}
      />
    </svg>
  );
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  sparkline,
  progress,
  progressLabel,
  variant = 'default',
  index = 0,
  onClick,
}: StatCardProps) {
  const s = variantStyles[variant] ?? variantStyles.default;

  const isFlat = !trend || trend.value === 0;
  const isUp = trend?.isPositive;
  const TrendIcon = isFlat ? Minus : isUp ? TrendingUp : TrendingDown;
  const trendCls = !trend
    ? ''
    : isFlat
      ? 'bg-muted text-muted-foreground'
      : isUp
        ? s.trendPos
        : s.trendNeg;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      onClick={onClick}
      className={cn(
        'bg-card border border-border rounded-2xl p-5 transition-shadow',
        onClick && 'cursor-pointer hover:shadow-sm'
      )}
    >
      {/* Row 1 — title + icon */}
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-muted-foreground font-medium leading-snug">{title}</p>
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', s.icon)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Row 2 — value + sparkline */}
      <div className="flex items-end justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-2">
            <span className={cn('text-3xl font-semibold tabular-nums tracking-tight', s.value)}>
              <AnimatedNumber to={value} />
            </span>

            {trend && (
              <span className={cn('inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-md', trendCls)}>
                <TrendIcon className="w-3 h-3" />
                {trend.value === 0 ? '–' : `${trend.isPositive ? '+' : ''}${trend.value}%`}
              </span>
            )}
          </div>

          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>

        {sparkline && sparkline.length > 1 && (
          <div className="opacity-60 shrink-0">
            <Sparkline data={sparkline} stroke={s.sparkStroke} fill={s.sparkFill} />
          </div>
        )}
      </div>

      {/* Progress bar */}
      {typeof progress === 'number' && (
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{progressLabel ?? 'Utilisation'}</span>
            <span className="text-xs font-medium text-foreground">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ delay: index * 0.1 + 0.4, duration: 0.6, ease: 'easeOut' }}
              className={cn('h-full rounded-full', s.progressBar)}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}