'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const { isAuthenticated, currentDoctor } = useAuth();
    const router = useRouter();

    // desktop sidebar width — on mobile this doesn't matter (sidebar is a drawer)
    const sidebarWidth = isCollapsed ? 72 : 240;

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && !isAuthenticated) {
            router.push('/login');
        }
    }, [isMounted, isAuthenticated, router]);

    // close mobile drawer on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setIsMobileOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isMounted || !isAuthenticated || !currentDoctor) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">

            {/* Sidebar — desktop fixed + mobile drawer */}
            <Sidebar
                isCollapsed={isCollapsed}
                onToggle={() => setIsCollapsed(!isCollapsed)}
                isMobileOpen={isMobileOpen}
                onMobileClose={() => setIsMobileOpen(false)}
            />

            {/* Topbar — hamburger opens mobile drawer */}
            <Topbar
                sidebarWidth={sidebarWidth}
                onMobileMenuToggle={() => setIsMobileOpen(true)}
            />

            {/* Main content
          - Mobile (< md): no left margin, full width
          - Desktop (>= md): left margin = sidebarWidth
      */}
            <div
                className="pt-16 min-h-screen transition-all duration-200 ease-in-out md:block"
                style={
                    {
                        '--sidebar-w': `${sidebarWidth}px`,
                    } as React.CSSProperties
                }
            >
                <div className="ml-0 md:[margin-left:var(--sidebar-w)]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={typeof window !== 'undefined' ? window.location.pathname : ''}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="p-4 sm:p-6"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

        </div>
    );
}