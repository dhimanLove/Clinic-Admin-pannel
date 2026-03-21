'use client';

import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppointments } from '@/hooks/useAppointments';
import { StatCard } from '@/components/dashboard/stat-card';
import { RecentAppointments } from '@/components/dashboard/recent-appointments';
import { StatusChart } from '@/components/dashboard/status-chart';

export default function DashboardPage() {
  const { currentDoctor } = useAuth();
  const { getStats } = useAppointments();

  const stats = currentDoctor ? getStats(currentDoctor.id) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {currentDoctor?.name.split(' ')[0]}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Appointments"
          value={stats?.total || 0}
          icon={Calendar}
          variant="primary"
          index={0}
        />
        <StatCard
          title="Pending"
          value={stats?.pending || 0}
          icon={Clock}
          description="Awaiting your response"
          variant="warning"
          index={1}
        />
        <StatCard
          title="Accepted"
          value={stats?.accepted || 0}
          icon={CheckCircle}
          variant="success"
          index={2}
        />
        <StatCard
          title="Rejected"
          value={stats?.rejected || 0}
          icon={XCircle}
          variant="destructive"
          index={3}
        />
      </div>

      {/* Charts & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAppointments />
        <StatusChart />
      </div>
    </div>
  );
}
