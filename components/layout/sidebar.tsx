'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  Users,
  UserCog,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useAppointments } from '@/hooks/useAppointments';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}
const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Appointments', href: '/appointments', icon: Calendar },
  { label: 'Patient Details', href: '/patients', icon: Users },
  { label: 'Hospital Staff Record', href: '/staff', icon: UserCog },
  { label: 'Settings', href: '/settings', icon: Settings },
];

/* ── shared inner content — used by both desktop sidebar and mobile drawer ── */
function SidebarContent({
  isCollapsed,
  onToggle,
  onClose,
  isMobile = false,
}: {
  isCollapsed: boolean;
  onToggle: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}) {
  const pathname = usePathname();
  const { currentDoctor } = useAuth();
  const { getStats } = useAppointments();

  const stats = currentDoctor ? getStats(currentDoctor.id) : null;
  const border = isMobile ? 'border-border' : 'border-sidebar-border';
  const fg = isMobile ? 'text-foreground' : 'text-sidebar-foreground';
  const fgMuted = isMobile ? 'text-muted-foreground' : 'text-sidebar-foreground/50';
  const fgDim = isMobile ? 'text-muted-foreground/70' : 'text-sidebar-foreground/60';
  const hoverBg = isMobile ? 'hover:bg-muted/60' : 'hover:bg-sidebar-accent/50';
  const activeText = isMobile ? 'text-foreground' : 'text-sidebar-primary';
  const activeBg = isMobile ? 'bg-muted' : 'bg-sidebar-accent';
  const softCardBg = isMobile ? 'bg-muted/60' : 'bg-sidebar-accent/60';

  const initials =
    currentDoctor?.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? '';

  /* close mobile drawer on nav click */
  const handleNavClick = () => {
    if (isMobile && onClose) onClose();
  };

  return (
    <div className="flex flex-col h-full">

      {/* ── Logo ── */}
      <div className={cn('h-16 flex items-center px-4 border-b flex-shrink-0', border)}>
        <div className="flex items-center gap-3 overflow-hidden flex-1">
          <div className={cn('w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 border', border)}>
            <img
              src="https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-ZeYYce1tWi91YU7Z0rerVmNRCWyCkX.png&w=500&q=75"
              alt="Neeraj Dental Clinic"
              className="w-full h-full object-cover"
            />
          </div>
          <AnimatePresence initial={false}>
            {(!isCollapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden flex-1"
              >
                <p className={cn('font-semibold whitespace-nowrap leading-none text-sm', fg)}>
                  Neeraj Dental
                </p>
                <p className={cn('text-[11px] whitespace-nowrap mt-0.5 leading-none', fgMuted)}>
                  Clinic Panel
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Close button — mobile only */}
        {isMobile && (
          <button
            onClick={onClose}
            title="Close sidebar"
            className={cn(
              'w-8 h-8 rounded-xl flex items-center justify-center transition-colors flex-shrink-0',
              fgDim,
              `hover:${fg}`,
              isMobile ? 'hover:bg-muted' : 'hover:bg-sidebar-accent'
            )}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {/* ── Navigation ── */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={handleNavClick}
                  title={isCollapsed && !isMobile ? item.label : undefined}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors relative group',
                    isActive
                      ? activeText
                      : cn(fgDim, hoverBg, isMobile ? 'hover:text-foreground' : 'hover:text-sidebar-foreground'),
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId={isMobile ? 'activeNavMobile' : 'activeNav'}
                      className={cn('absolute inset-0 rounded-xl', activeBg)}
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                    />
                  )}
                  <Icon className="w-5 h-5 relative z-10 flex-shrink-0" />
                  <AnimatePresence initial={false}>
                    {(!isCollapsed || isMobile) && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.12 }}
                        className="text-sm font-medium relative z-10 whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── Stats mini-cards ── */}
        <AnimatePresence initial={false}>
          {(!isCollapsed || isMobile) && stats && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="mt-6 space-y-2"
            >
              <p className={cn('text-[10px] font-semibold uppercase tracking-widest px-1 mb-3', isMobile ? 'text-muted-foreground' : 'text-sidebar-foreground/40')}>
                Today's overview
              </p>
              <div className={cn('rounded-xl p-3 flex items-center gap-3', softCardBg)}>
                <div className="w-7 h-7 rounded-lg bg-warning/15 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-3.5 h-3.5 text-warning-foreground" />
                </div>
                <div className="min-w-0">
                  <p className={cn('text-[11px] leading-none', fgMuted)}>Pending</p>
                  <p className={cn('text-sm font-semibold mt-0.5 leading-none', fg)}>{stats.pending}</p>
                </div>
              </div>
              <div className={cn('rounded-xl p-3 flex items-center gap-3', softCardBg)}>
                <div className="w-7 h-7 rounded-lg bg-success/15 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                </div>
                <div className="min-w-0">
                  <p className={cn('text-[11px] leading-none', fgMuted)}>Accepted</p>
                  <p className={cn('text-sm font-semibold mt-0.5 leading-none', fg)}>{stats.accepted}</p>
                </div>
              </div>
              <div className={cn('rounded-xl p-3 flex items-center gap-3', softCardBg)}>
                <div className="w-7 h-7 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-3.5 h-3.5 text-destructive" />
                </div>
                <div className="min-w-0">
                  <p className={cn('text-[11px] leading-none', fgMuted)}>Rejected</p>
                  <p className={cn('text-sm font-semibold mt-0.5 leading-none', fg)}>{stats.rejected}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Doctor card + collapse ── */}
      <div className={cn('border-t flex-shrink-0', border)}>
        <AnimatePresence initial={false}>
          {(!isCollapsed || isMobile) && currentDoctor && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className={cn('px-4 py-3 flex items-center gap-3 border-b', border)}
            >
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-primary">{initials}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className={cn('text-xs font-semibold truncate leading-none', fg)}>
                  {currentDoctor.name}
                </p>
                <p className={cn('text-[11px] truncate mt-0.5 leading-none', fgMuted)}>
                  {currentDoctor.specialization}
                </p>
              </div>
              <span className="w-2 h-2 rounded-full bg-success flex-shrink-0" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse toggle — desktop only */}
        {!isMobile && (
          <div className="p-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className={cn(
                'w-full rounded-xl hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground h-9',
                isCollapsed ? 'justify-center px-0' : 'justify-start px-3 gap-2',
              )}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm">Collapse</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════ */
export function Sidebar({ isCollapsed, onToggle, isMobileOpen = false, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* ── Desktop sidebar ── */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 72 : 240 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="hidden md:flex fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex-col z-40 overflow-hidden"
      >
        <SidebarContent isCollapsed={isCollapsed} onToggle={onToggle} />
      </motion.aside>

      {/* ── Mobile drawer backdrop ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-50 md:hidden"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile drawer panel ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 h-screen w-72 bg-background text-foreground border-r border-border flex flex-col z-50 md:hidden overflow-hidden"
          >
            <SidebarContent
              isCollapsed={false}
              onToggle={onToggle}
              onClose={onMobileClose}
              isMobile
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}