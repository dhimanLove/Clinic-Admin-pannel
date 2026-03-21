'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, LogOut, User, CheckCheck, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppointments } from '@/hooks/useAppointments';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface TopbarProps {
  sidebarWidth: number;
  onMobileMenuToggle?: () => void;
}

function useGreeting(name?: string) {
  const hour = new Date().getHours();
  const base = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return name ? `${base}, Dr. ${name.split(' ')[0]}` : base;
}

function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function Topbar({ sidebarWidth, onMobileMenuToggle }: TopbarProps) {
  const { currentDoctor, logout } = useAuth();
  const { getStats, getAppointmentsForDoctor } = useAppointments();
  const router = useRouter();
  const time = useClock();
  const greeting = useGreeting(currentDoctor?.name);

  const stats = currentDoctor ? getStats(currentDoctor.id) : null;
  const pendingCount = stats?.pending || 0;

  const pendingAppts = currentDoctor
      ? getAppointmentsForDoctor(currentDoctor.id)
          .filter((a) => a.status === 'pending')
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3)
      : [];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const initials = currentDoctor?.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const fmtTime = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const fmtDate = time.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
      <motion.header
          initial={false}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="fixed top-0 right-0 h-16 bg-background/80 backdrop-blur-sm border-b border-border z-30 flex items-center justify-between px-3 sm:px-6 gap-2"
          /* mobile: left=0, desktop: left=sidebarWidth passed via style */
          style={{ left: typeof window !== 'undefined' && window.innerWidth >= 768 ? sidebarWidth : 0 }}
      >
        {/* ── Left side ── */}
        <div className="flex items-center gap-2 min-w-0 flex-1">

          {/* Hamburger — LEFTMOST, mobile only */}
          <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 rounded-xl flex-shrink-0"
              onClick={onMobileMenuToggle}
              aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Greeting */}
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{greeting}</p>
            <p className="text-xs text-muted-foreground truncate hidden sm:block">{currentDoctor?.clinicName}</p>
          </div>
        </div>

        {/* ── Right side ── */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">

          {/* Clock — visible on mobile too, just compact */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-xl bg-muted/60 border border-border">
            <span className="text-xs font-medium text-foreground tabular-nums">{fmtTime}</span>
            <span className="w-px h-3 bg-border hidden xs:block" />
            <span className="text-xs text-muted-foreground hidden sm:block">{fmtDate}</span>
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-xl h-9 w-9">
                <Bell className="w-4 h-4" />
                {pendingCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-semibold rounded-full flex items-center justify-center"
                    >
                      {pendingCount > 9 ? '9+' : pendingCount}
                    </motion.span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-2xl p-0 overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <p className="text-sm font-semibold">Notifications</p>
                {pendingCount > 0 && (
                    <Badge variant="outline" className="rounded-lg text-xs bg-destructive/10 text-destructive border-destructive/20">
                      {pendingCount} pending
                    </Badge>
                )}
              </div>

              {pendingAppts.length > 0 ? (
                  <div className="py-1.5">
                    {pendingAppts.map((appt) => (
                        <DropdownMenuItem
                            key={appt.id}
                            className="px-4 py-3 cursor-pointer mx-1.5 rounded-xl gap-3 focus:bg-muted/60"
                            onClick={() => router.push('/appointments')}
                        >
                          <div className="w-8 h-8 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
                            <Bell className="w-3.5 h-3.5 text-warning-foreground" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">{appt.patientName}</p>
                            <p className="text-xs text-muted-foreground truncate">{appt.issue}</p>
                          </div>
                          <span className="w-1.5 h-1.5 rounded-full bg-warning flex-shrink-0" />
                        </DropdownMenuItem>
                    ))}
                    <div className="px-4 pt-1 pb-2">
                      <Button
                          variant="ghost" size="sm"
                          className="w-full rounded-xl text-xs text-muted-foreground h-8"
                          onClick={() => router.push('/appointments')}
                      >
                        View all appointments
                      </Button>
                    </div>
                  </div>
              ) : (
                  <div className="py-10 flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      <CheckCheck className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">All caught up!</p>
                    <p className="text-xs text-muted-foreground/60">No pending appointments</p>
                  </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="w-px h-6 bg-border" />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-xl px-2 gap-2 h-9">
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {/* Name only on sm+ */}
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold leading-none">{currentDoctor?.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-none">{currentDoctor?.specialization}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 rounded-2xl p-0 overflow-hidden">
              <div className="px-4 py-4 border-b border-border flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{currentDoctor?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{currentDoctor?.email}</p>
                </div>
              </div>
              <div className="px-4 py-2.5 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">Available for appointments</span>
                </div>
              </div>
              <div className="py-1.5 px-1.5">
                <DropdownMenuItem
                    className="px-3 py-2 cursor-pointer rounded-xl gap-2"
                    onClick={() => router.push('/settings')}
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Profile & Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                    className="px-3 py-2 cursor-pointer rounded-xl gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                    onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.header>
  );
}