'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Building, Phone, Mail, Bell, MessageSquare,
    Camera, Shield, Clock, Stethoscope, ChevronRight, Save,
    Sun, Moon, Upload, MapPin, CheckCircle, XCircle,
    Smartphone, Monitor, Tablet, LogOut, Key, Eye, EyeOff,
    Send, Check, AlertCircle, Globe, Instagram, Twitter,
    Loader2, Lock, Unlock,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/* ═══════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════ */
const MOCK_SESSIONS = [
    { id: '1', device: 'Chrome on Windows', icon: Monitor, location: 'Mumbai, IN', time: 'Active now', current: true },
    { id: '2', device: 'Safari on iPhone', icon: Smartphone, location: 'Delhi, IN', time: '2 hours ago', current: false },
    { id: '3', device: 'Firefox on MacOS', icon: Monitor, location: 'Bangalore, IN', time: 'Yesterday', current: false },
    { id: '4', device: 'Chrome on iPad', icon: Tablet, location: 'Pune, IN', time: '3 days ago', current: false },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TIME_SLOTS = [
    '07:00','07:30','08:00','08:30','09:00','09:30',
    '10:00','10:30','11:00','11:30','12:00','12:30',
    '13:00','13:30','14:00','14:30','15:00','15:30',
    '16:00','16:30','17:00','17:30','18:00','18:30','19:00',
];

/* ═══════════════════════════════════════════════
   SMALL REUSABLE COMPONENTS
═══════════════════════════════════════════════ */
function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn('bg-card border border-border rounded-2xl p-5 sm:p-8', className)}>
            {children}
        </div>
    );
}

function SectionHeader({
                           icon: Icon, title, description, badge,
                       }: {
    icon: React.ElementType; title: string; description: string; badge?: string;
}) {
    return (
        <div className="flex items-start gap-4 mb-7 pb-6 border-b border-border">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2.5">
                    <h2 className="font-semibold text-foreground text-lg">{title}</h2>
                    {badge && (
                        <Badge variant="outline" className="text-xs rounded-lg px-2 py-0.5 border-primary/30 text-primary">
                            {badge}
                        </Badge>
                    )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
            </div>
        </div>
    );
}

function Field({
                   id, label, value, onChange, type = 'text', icon: Icon, placeholder, hint,
               }: {
    id: string; label: string; value: string; onChange: (v: string) => void;
    type?: string; icon?: React.ElementType; placeholder?: string; hint?: string;
}) {
    const [show, setShow] = useState(false);
    const isPassword = type === 'password';
    return (
        <div className="space-y-1.5">
            <Label htmlFor={id} className="text-sm font-medium text-foreground/80">{label}</Label>
            <div className="relative">
                {Icon && (
                    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                )}
                <Input
                    id={id}
                    type={isPassword ? (show ? 'text' : 'password') : type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={cn('h-11 rounded-xl bg-background border-border', Icon && 'pl-10', isPassword && 'pr-10')}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}
            </div>
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
    );
}

function Row2({ children }: { children: React.ReactNode }) {
    return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

function NotifRow({
                      icon: Icon, title, description, checked, onCheckedChange, last,
                  }: {
    icon: React.ElementType; title: string; description: string;
    checked: boolean; onCheckedChange: (v: boolean) => void; last?: boolean;
}) {
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleTest = async () => {
        if (!checked || sending) return;
        setSending(true);
        await new Promise((r) => setTimeout(r, 1400));
        setSending(false);
        setSent(true);
        toast.success(`Test ${title.split(' ')[0]} sent!`, { description: 'Check your device.' });
        setTimeout(() => setSent(false), 3000);
    };

    return (
        <div className={cn('flex items-center justify-between py-4 gap-4', !last && 'border-b border-border')}>
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
                    checked ? 'bg-primary/10' : 'bg-muted',
                )}>
                    <Icon className={cn('w-4 h-4 transition-colors', checked ? 'text-primary' : 'text-muted-foreground')} />
                </div>
                <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm">{title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{description}</p>
                </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
                {checked && (
                    <button
                        onClick={handleTest}
                        className={cn(
                            'flex items-center gap-1.5 text-xs px-2.5 sm:px-3 py-1.5 rounded-lg border transition-all',
                            sent
                                ? 'border-success/40 text-success bg-success/5'
                                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5',
                        )}
                    >
                        {sending ? <Loader2 className="w-3 h-3 animate-spin" />
                            : sent ? <Check className="w-3 h-3" />
                                : <Send className="w-3 h-3" />}
                        <span className="hidden sm:inline">
              {sending ? 'Sending...' : sent ? 'Sent!' : 'Test'}
            </span>
                    </button>
                )}
                <Switch checked={checked} onCheckedChange={onCheckedChange} />
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════ */
const NAV_ITEMS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'clinic', label: 'Clinic', icon: Building },
    { id: 'schedule', label: 'Schedule', icon: Clock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
];

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
export default function SettingsPage() {
    const { currentDoctor } = useAuth();
    const [activeSection, setActiveSection] = useState('profile');
    const [saving, setSaving] = useState(false);

    /* ── theme ── */
    const [isDark, setIsDark] = useState(() =>
        typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false,
    );
    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        document.documentElement.classList.toggle('dark', next);
        localStorage.setItem('theme', next ? 'dark' : 'light');
    };
    useEffect(() => {
        const saved = localStorage.getItem('theme');
        if (saved === 'dark') { setIsDark(true); document.documentElement.classList.add('dark'); }
        else if (saved === 'light') { setIsDark(false); document.documentElement.classList.remove('dark'); }
    }, []);

    /* ── photo upload ── */
    const photoRef = useRef<HTMLInputElement>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
        reader.readAsDataURL(f);
    };

    /* ── logo upload ── */
    const logoRef = useRef<HTMLInputElement>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
        reader.readAsDataURL(f);
    };

    /* ── settings state ── */
    const [s, setS] = useState({
        name: currentDoctor?.name || 'Dr. Aisha Sharma',
        email: currentDoctor?.email || 'aisha@cityclinic.in',
        phone: currentDoctor?.phone || '+91 98765 43210',
        bio: 'Compassionate cardiologist with 12+ years of experience in interventional cardiology.',
        website: 'www.draisha.in',
        instagram: '@dr.aisha',
        twitter: '@draisha_md',

        clinicName: currentDoctor?.clinicName || 'City Heart Clinic',
        address: '42, MG Road, Andheri West, Mumbai - 400058',
        clinicPhone: '+91 22 4567 8901',
        clinicEmail: 'hello@cityclinic.in',
        mapLink: 'https://maps.google.com/?q=Andheri+West+Mumbai',

        workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as string[],
        startTime: '09:00',
        endTime: '18:00',
        breakStart: '13:00',
        breakEnd: '14:00',
        slotDuration: '30',
        maxPerDay: '20',

        whatsapp: true,
        sms: false,
        emailNotif: true,
        reminders: true,
        newPatient: true,
        cancellation: true,

        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFA: false,
    });

    const update = (k: string, v: string | boolean | string[]) =>
        setS((p) => ({ ...p, [k]: v }));

    /* ── sessions ── */
    const [sessions, setSessions] = useState(MOCK_SESSIONS);
    const revokeSession = (id: string) => {
        setSessions((p) => p.filter((s) => s.id !== id));
        toast.success('Session revoked');
    };

    /* ── password strength ── */
    const pwStrength = (pw: string) => {
        if (!pw) return { score: 0, label: '', color: '' };
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        const map = [
            { label: 'Weak', color: 'bg-danger' },
            { label: 'Fair', color: 'bg-warning' },
            { label: 'Good', color: 'bg-warning' },
            { label: 'Strong', color: 'bg-success' },
            { label: 'Very strong', color: 'bg-success' },
        ];
        return { score, ...map[score] };
    };
    const strength = pwStrength(s.newPassword);

    /* ── save ── */
    const handleSave = async () => {
        setSaving(true);
        await new Promise((r) => setTimeout(r, 1000));
        setSaving(false);
        toast.success('Settings saved', { description: 'All changes have been applied.' });
    };

    /* ── initials ── */
    const initials = s.name
        ? s.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
        : 'DR';

    return (
        <div className="w-full space-y-6">

            {/* ── Header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Settings</h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base hidden sm:block">Manage your profile, clinic, schedule and security</p>
                </div>
                <button
                    onClick={toggleTheme}
                    className="w-11 h-11 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors flex-shrink-0"
                    title={isDark ? 'Switch to light' : 'Switch to dark'}
                >
                    {isDark ? <Sun className="w-5 h-5 text-warning" /> : <Moon className="w-5 h-5 text-muted-foreground" />}
                </button>
            </div>

            {/* ── Mobile nav (horizontal scroll) ── */}
            <div className="flex lg:hidden gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
                {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveSection(id)}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex-shrink-0 border',
                            activeSection === id
                                ? 'bg-primary/10 text-primary border-primary/30'
                                : 'text-muted-foreground border-border bg-card hover:bg-muted',
                        )}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </button>
                ))}
            </div>

            <div className="flex gap-8 items-start">

                {/* ── Sidebar (desktop only) ── */}
                <motion.aside
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hidden lg:block w-64 flex-shrink-0 bg-card border border-border rounded-2xl p-2 sticky top-6"
                >
                    {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveSection(id)}
                            className={cn(
                                'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-colors text-left',
                                activeSection === id
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                            )}
                        >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            {label}
                            {activeSection === id && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                        </button>
                    ))}

                    <div className="mt-3 pt-3 border-t border-border px-1">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full rounded-xl h-10 bg-primary text-white hover:opacity-90 shadow-none text-sm"
                        >
                            {saving
                                ? <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                : <Save className="w-4 h-4 mr-2" />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </motion.aside>

                {/* ── Content ── */}
                <div className="flex-1 min-w-0 space-y-5">
                    <AnimatePresence mode="wait">

                        {/* ═══ PROFILE ═══ */}
                        {activeSection === 'profile' && (
                            <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">

                                <SectionCard>
                                    <SectionHeader icon={User} title="Profile" description="Your public-facing identity as a doctor" />

                                    {/* Avatar */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-24 h-24 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-semibold overflow-hidden">
                                                {photoPreview
                                                    ? <img src={photoPreview} alt="avatar" className="w-full h-full object-cover" />
                                                    : initials}
                                            </div>
                                            <button
                                                onClick={() => photoRef.current?.click()}
                                                className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
                                            >
                                                <Camera className="w-4 h-4 text-white" />
                                            </button>
                                            <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground text-lg">{s.name}</p>
                                            <p className="text-sm text-muted-foreground">{s.email}</p>
                                            <button
                                                onClick={() => photoRef.current?.click()}
                                                className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
                                            >
                                                <Upload className="w-3 h-3" /> Upload new photo
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Row2>
                                            <Field id="name" label="Full Name" value={s.name} onChange={(v) => update('name', v)} icon={User} placeholder="Dr. Full Name" />
                                            <Field id="spec" label="Specialization" value={currentDoctor?.specialization || 'Cardiologist'} onChange={() => {}} icon={Stethoscope} placeholder="e.g. Cardiologist" />
                                        </Row2>
                                        <Row2>
                                            <Field id="email" label="Email" value={s.email} onChange={(v) => update('email', v)} icon={Mail} type="email" />
                                            <Field id="phone" label="Phone" value={s.phone} onChange={(v) => update('phone', v)} icon={Phone} />
                                        </Row2>
                                        <Field id="bio" label="Short Bio" value={s.bio} onChange={(v) => update('bio', v)} placeholder="Brief professional description..." />
                                    </div>
                                </SectionCard>

                                {/* Social */}
                                <SectionCard>
                                    <SectionHeader icon={Globe} title="Online Presence" description="Your website and social profiles" />
                                    <div className="space-y-4">
                                        <Field id="web" label="Website" value={s.website} onChange={(v) => update('website', v)} icon={Globe} placeholder="www.yoursite.com" />
                                        <Row2>
                                            <Field id="insta" label="Instagram" value={s.instagram} onChange={(v) => update('instagram', v)} icon={Instagram} placeholder="@handle" />
                                            <Field id="tw" label="Twitter / X" value={s.twitter} onChange={(v) => update('twitter', v)} icon={Twitter} placeholder="@handle" />
                                        </Row2>
                                    </div>
                                </SectionCard>

                            </motion.div>
                        )}

                        {/* ═══ CLINIC ═══ */}
                        {activeSection === 'clinic' && (
                            <motion.div key="clinic" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">

                                <SectionCard>
                                    <SectionHeader icon={Building} title="Clinic Details" description="Information about your practice" />

                                    {/* Logo upload */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 mb-7">
                                        <div
                                            className="w-20 h-20 rounded-2xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted cursor-pointer hover:border-primary/50 transition-colors"
                                            onClick={() => logoRef.current?.click()}
                                        >
                                            {logoPreview
                                                ? <img src={logoPreview} alt="logo" className="w-full h-full object-cover rounded-2xl" />
                                                : <Upload className="w-6 h-6 text-muted-foreground" />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground text-sm">{s.clinicName}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG up to 2MB</p>
                                            <button
                                                onClick={() => logoRef.current?.click()}
                                                className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
                                            >
                                                <Upload className="w-3 h-3" /> {logoPreview ? 'Change logo' : 'Upload logo'}
                                            </button>
                                        </div>
                                        <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
                                    </div>

                                    <div className="space-y-4">
                                        <Row2>
                                            <Field id="cname" label="Clinic Name" value={s.clinicName} onChange={(v) => update('clinicName', v)} icon={Building} />
                                            <Field id="cph" label="Clinic Phone" value={s.clinicPhone} onChange={(v) => update('clinicPhone', v)} icon={Phone} />
                                        </Row2>
                                        <Field id="cem" label="Clinic Email" value={s.clinicEmail} onChange={(v) => update('clinicEmail', v)} icon={Mail} type="email" />
                                        <Field id="addr" label="Address" value={s.address} onChange={(v) => update('address', v)} icon={MapPin} placeholder="Full clinic address" />
                                    </div>
                                </SectionCard>

                                {/* Map preview */}
                                <SectionCard>
                                    <SectionHeader icon={MapPin} title="Location Preview" description="How your clinic appears on the map" />
                                    <div className="rounded-xl overflow-hidden border border-border bg-muted h-52 flex items-center justify-center relative">
                                        <div
                                            className="absolute inset-0 opacity-10"
                                            style={{
                                                backgroundImage: 'repeating-linear-gradient(0deg,currentColor,currentColor 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,currentColor,currentColor 1px,transparent 1px,transparent 40px)',
                                            }}
                                        />
                                        <div className="flex flex-col items-center gap-3 z-10">
                                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                                <MapPin className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="bg-card border border-border rounded-xl px-4 py-2 text-center shadow-sm">
                                                <p className="font-medium text-foreground text-sm">{s.clinicName}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{s.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-3">
                                        <Field id="map" label="Google Maps Link" value={s.mapLink} onChange={(v) => update('mapLink', v)} icon={Globe} placeholder="https://maps.google.com/..." />
                                        <a
                                            href={s.mapLink} target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                                        >
                                            <Globe className="w-4 h-4" /> Open in Google Maps
                                        </a>
                                    </div>
                                </SectionCard>

                            </motion.div>
                        )}

                        {/* ═══ SCHEDULE ═══ */}
                        {activeSection === 'schedule' && (
                            <motion.div key="schedule" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">

                                <SectionCard>
                                    <SectionHeader icon={Clock} title="Working Days & Hours" description="Set when you are available for appointments" badge="Live" />

                                    {/* Day toggles */}
                                    <div className="flex gap-2 flex-wrap mb-5">
                                        {DAYS.map((day) => {
                                            const active = s.workDays.includes(day);
                                            return (
                                                <button
                                                    key={day}
                                                    onClick={() => {
                                                        const next = active
                                                            ? s.workDays.filter((d) => d !== day)
                                                            : [...s.workDays, day];
                                                        update('workDays', next);
                                                    }}
                                                    className={cn(
                                                        'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center text-xs font-semibold border transition-all',
                                                        active
                                                            ? 'bg-primary text-white border-primary shadow-md scale-105'
                                                            : 'bg-muted text-muted-foreground border-border hover:border-primary/40',
                                                    )}
                                                >
                                                    {day}
                                                    {active && <div className="w-1.5 h-1.5 rounded-full bg-white/70 mt-1" />}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Summary */}
                                    <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-xl mb-6">
                                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                        <p className="text-sm text-primary">
                                            Working <span className="font-semibold">{s.workDays.length} days/week</span> — {s.workDays.join(', ')}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <Row2>
                                            <div className="space-y-1.5">
                                                <Label className="text-sm font-medium text-foreground/80">Start Time</Label>
                                                <select
                                                    value={s.startTime}
                                                    onChange={(e) => update('startTime', e.target.value)}
                                                    className="w-full h-11 rounded-xl bg-background border border-border px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                >
                                                    {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-sm font-medium text-foreground/80">End Time</Label>
                                                <select
                                                    value={s.endTime}
                                                    onChange={(e) => update('endTime', e.target.value)}
                                                    className="w-full h-11 rounded-xl bg-background border border-border px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                >
                                                    {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                            </div>
                                        </Row2>
                                        <Row2>
                                            <div className="space-y-1.5">
                                                <Label className="text-sm font-medium text-foreground/80">Break Start</Label>
                                                <select
                                                    value={s.breakStart}
                                                    onChange={(e) => update('breakStart', e.target.value)}
                                                    className="w-full h-11 rounded-xl bg-background border border-border px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                >
                                                    {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-sm font-medium text-foreground/80">Break End</Label>
                                                <select
                                                    value={s.breakEnd}
                                                    onChange={(e) => update('breakEnd', e.target.value)}
                                                    className="w-full h-11 rounded-xl bg-background border border-border px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                >
                                                    {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                            </div>
                                        </Row2>
                                        <Row2>
                                            <Field id="slot" label="Slot Duration (min)" value={s.slotDuration} onChange={(v) => update('slotDuration', v)} placeholder="30" hint="Length of each appointment" />
                                            <Field id="max" label="Max Appointments / Day" value={s.maxPerDay} onChange={(v) => update('maxPerDay', v)} placeholder="20" hint="Set 0 for unlimited" />
                                        </Row2>
                                    </div>
                                </SectionCard>

                                {/* Visual week preview */}
                                <SectionCard>
                                    <SectionHeader icon={Clock} title="Weekly Preview" description="Patient-facing schedule view" />
                                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                        {DAYS.map((day) => {
                                            const active = s.workDays.includes(day);
                                            return (
                                                <div
                                                    key={day}
                                                    className={cn(
                                                        'rounded-xl p-3 text-center border transition-all',
                                                        active ? 'border-primary/20 bg-primary/5' : 'border-border bg-muted opacity-40',
                                                    )}
                                                >
                                                    <p className="text-xs font-semibold text-foreground">{day}</p>
                                                    {active ? (
                                                        <>
                                                            <p className="text-xs text-primary mt-1.5 font-medium">{s.startTime}</p>
                                                            <div className="w-0.5 h-4 bg-primary/30 mx-auto my-1" />
                                                            <p className="text-xs text-primary font-medium">{s.endTime}</p>
                                                        </>
                                                    ) : (
                                                        <p className="text-xs text-muted-foreground mt-2">Off</p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </SectionCard>

                            </motion.div>
                        )}

                        {/* ═══ NOTIFICATIONS ═══ */}
                        {activeSection === 'notifications' && (
                            <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">

                                <SectionCard>
                                    <SectionHeader icon={Bell} title="Notification Channels" description="Toggle and test each channel live" />
                                    <NotifRow icon={MessageSquare} title="WhatsApp" description="Appointment confirmations & reminders via WhatsApp" checked={s.whatsapp} onCheckedChange={(v) => update('whatsapp', v)} />
                                    <NotifRow icon={Phone} title="SMS" description="Text message confirmations" checked={s.sms} onCheckedChange={(v) => update('sms', v)} />
                                    <NotifRow icon={Mail} title="Email" description="Detailed email with calendar invite" checked={s.emailNotif} onCheckedChange={(v) => update('emailNotif', v)} />
                                    <NotifRow icon={Bell} title="Reminders" description="Auto-remind patients 24h before" checked={s.reminders} onCheckedChange={(v) => update('reminders', v)} />
                                    <NotifRow icon={User} title="New Patient Alert" description="Notify you when a new patient books" checked={s.newPatient} onCheckedChange={(v) => update('newPatient', v)} />
                                    <NotifRow icon={AlertCircle} title="Cancellation Alert" description="Alert when patient cancels or reschedules" checked={s.cancellation} onCheckedChange={(v) => update('cancellation', v)} last />
                                </SectionCard>

                                {/* Active summary */}
                                <SectionCard>
                                    <SectionHeader icon={CheckCircle} title="Active Channels" description="Currently sending notifications" />
                                    <div className="flex flex-wrap gap-2">
                                        {([
                                            { key: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                                            { key: 'sms', label: 'SMS', icon: Phone },
                                            { key: 'emailNotif', label: 'Email', icon: Mail },
                                            { key: 'reminders', label: 'Reminders', icon: Bell },
                                            { key: 'newPatient', label: 'New Patient', icon: User },
                                            { key: 'cancellation', label: 'Cancellations', icon: AlertCircle },
                                        ] as { key: keyof typeof s; label: string; icon: React.ElementType }[]).map(({ key, label, icon: Icon }) => {
                                            const on = s[key] as boolean;
                                            return (
                                                <div
                                                    key={key}
                                                    className={cn(
                                                        'flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all',
                                                        on ? 'border-success/30 bg-success/5 text-success' : 'border-border bg-muted text-muted-foreground opacity-50',
                                                    )}
                                                >
                                                    <Icon className="w-3.5 h-3.5" />
                                                    {label}
                                                    {on ? <Check className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </SectionCard>

                            </motion.div>
                        )}

                        {/* ═══ SECURITY ═══ */}
                        {activeSection === 'security' && (
                            <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">

                                {/* Password */}
                                <SectionCard>
                                    <SectionHeader icon={Key} title="Change Password" description="Use a strong, unique password for your account" />
                                    <div className="space-y-4">
                                        <Field id="cur" label="Current Password" value={s.currentPassword} onChange={(v) => update('currentPassword', v)} type="password" icon={Lock} placeholder="••••••••" />
                                        <Row2>
                                            <Field id="np" label="New Password" value={s.newPassword} onChange={(v) => update('newPassword', v)} type="password" icon={Lock} placeholder="••••••••" />
                                            <Field id="cp" label="Confirm Password" value={s.confirmPassword} onChange={(v) => update('confirmPassword', v)} type="password" icon={Lock} placeholder="••••••••" />
                                        </Row2>

                                        {s.newPassword && (
                                            <div className="space-y-2">
                                                <div className="flex gap-1.5">
                                                    {[1, 2, 3, 4].map((i) => (
                                                        <div
                                                            key={i}
                                                            className={cn(
                                                                'h-1.5 flex-1 rounded-full transition-all duration-300',
                                                                i <= strength.score ? strength.color : 'bg-muted',
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Strength: <span className="font-medium text-foreground">{strength.label}</span>
                                                </p>
                                            </div>
                                        )}

                                        {s.confirmPassword && (
                                            <div className={cn(
                                                'flex items-center gap-2 text-xs px-3 py-2.5 rounded-xl',
                                                s.newPassword === s.confirmPassword ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger',
                                            )}>
                                                {s.newPassword === s.confirmPassword
                                                    ? <><Check className="w-3.5 h-3.5" /> Passwords match</>
                                                    : <><XCircle className="w-3.5 h-3.5" /> Passwords do not match</>}
                                            </div>
                                        )}

                                        <div className="p-4 bg-warning/10 border border-warning/20 rounded-xl">
                                            <p className="text-sm font-medium text-warning mb-2">Requirements</p>
                                            <ul className="space-y-1.5">
                                                {([
                                                    ['8+ characters', s.newPassword.length >= 8],
                                                    ['One uppercase letter', /[A-Z]/.test(s.newPassword)],
                                                    ['One number', /[0-9]/.test(s.newPassword)],
                                                    ['One special character', /[^A-Za-z0-9]/.test(s.newPassword)],
                                                ] as [string, boolean][]).map(([label, met]) => (
                                                    <li key={label} className={cn('text-xs flex items-center gap-2 transition-colors', met ? 'text-success' : 'text-muted-foreground')}>
                                                        {met
                                                            ? <Check className="w-3 h-3 flex-shrink-0" />
                                                            : <div className="w-3 h-3 rounded-full border border-current flex-shrink-0" />}
                                                        {label}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </SectionCard>

                                {/* 2FA */}
                                <SectionCard>
                                    <SectionHeader icon={Smartphone} title="Two-Factor Authentication" description="Add an extra layer of security to your account" />
                                    <div className={cn(
                                        'flex items-center justify-between p-5 rounded-xl border transition-colors',
                                        s.twoFA ? 'border-success/30 bg-success/5' : 'border-border bg-muted/40',
                                    )}>
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                'w-11 h-11 rounded-xl flex items-center justify-center transition-colors',
                                                s.twoFA ? 'bg-success/10' : 'bg-muted',
                                            )}>
                                                {s.twoFA
                                                    ? <Lock className="w-5 h-5 text-success" />
                                                    : <Unlock className="w-5 h-5 text-muted-foreground" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground text-sm">Authenticator App (TOTP)</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {s.twoFA ? 'Enabled — your account is secured with 2FA' : 'Disabled — enable for extra protection'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge
                                                variant="outline"
                                                className={cn('text-xs rounded-lg', s.twoFA ? 'border-success/40 text-success' : 'border-border text-muted-foreground')}
                                            >
                                                {s.twoFA ? 'Active' : 'Off'}
                                            </Badge>
                                            <Switch
                                                checked={s.twoFA}
                                                onCheckedChange={(v) => {
                                                    update('twoFA', v);
                                                    toast.success(v ? '2FA enabled' : '2FA disabled', {
                                                        description: v ? 'Your account is now more secure.' : '2FA has been turned off.',
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </SectionCard>

                                {/* Sessions */}
                                <SectionCard>
                                    <SectionHeader icon={Monitor} title="Active Sessions" description="Devices currently logged into your account" />
                                    <div className="space-y-3">
                                        {sessions.map((session) => {
                                            const Icon = session.icon;
                                            return (
                                                <div
                                                    key={session.id}
                                                    className={cn(
                                                        'flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-colors',
                                                        session.current ? 'border-primary/30 bg-primary/5' : 'border-border bg-muted/30',
                                                    )}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn(
                                                            'w-10 h-10 rounded-xl flex items-center justify-center',
                                                            session.current ? 'bg-primary/10' : 'bg-muted',
                                                        )}>
                                                            <Icon className={cn('w-5 h-5', session.current ? 'text-primary' : 'text-muted-foreground')} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-medium text-foreground text-sm">{session.device}</p>
                                                                {session.current && (
                                                                    <Badge variant="outline" className="text-xs rounded-md border-primary/30 text-primary px-1.5 py-0">
                                                                        This device
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                                {session.location} · {session.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {!session.current && (
                                                        <button
                                                            onClick={() => revokeSession(session.id)}
                                                            className="flex items-center justify-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-danger/30 text-danger hover:bg-danger/10 transition-colors sm:self-center self-end"
                                                        >
                                                            <LogOut className="w-3 h-3" /> Revoke
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {sessions.length === 1 && (
                                            <p className="text-xs text-muted-foreground text-center py-3">
                                                No other active sessions
                                            </p>
                                        )}
                                    </div>
                                </SectionCard>

                            </motion.div>
                        )}

                    </AnimatePresence>

                    {/* Bottom save */}
                    <div className="flex justify-end pt-2">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="rounded-xl px-8 h-11 bg-primary text-white hover:opacity-90 shadow-none"
                        >
                            {saving
                                ? <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                : <Save className="w-4 h-4 mr-2" />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
}