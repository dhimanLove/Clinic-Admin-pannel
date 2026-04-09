"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockCredentials } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const success = await login(email, password);
    if (success) router.push("/dashboard");
  };

  const fillDemo = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    clearError();
  };

  const demoAccounts = Object.entries(mockCredentials).slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* ═══ LEFT — form ═══ */}
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="order-2 lg:order-1 flex items-center justify-center px-5 py-10 sm:px-10"
        >
          <div className="w-full max-w-[520px]">
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="w-11 h-11 rounded-2xl overflow-hidden border border-border shadow-sm flex-shrink-0">
                  <img
                    src="https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-ZeYYce1tWi91YU7Z0rerVmNRCWyCkX.png&w=500&q=75"
                    alt="Neeraj Dental"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm leading-none">
                    Neeraj Dental Clinic
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Admin Portal
                  </p>
                </div>
              </motion.div>

              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="mb-7"
              >
                <p className="text-primary text-xs font-bold tracking-widest uppercase mb-3">
                  Welcome back Doctor
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-[1.12] mb-3">
                  Sign in to your account
                </h1>
                <p className="text-muted-foreground text-base">
                  Enter your credentials to access the clinic dashboard
                </p>
              </motion.div>

              {/* Demo card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36 }}
                className="mb-8 p-4 bg-card border border-border rounded-2xl"
              >
                <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-3">
                  Quick demo login
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  {demoAccounts.map(([e, p]) => {
                    const name = e.split("@")[0];
                    const label = `Dr. ${name.charAt(0).toUpperCase() + name.slice(1)}`;
                    return (
                      <button
                        key={e}
                        onClick={() => fillDemo(e, p)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted hover:bg-primary/10 hover:border-primary/30 border border-border transition-all text-xs font-medium text-foreground flex-1 justify-center"
                      >
                        <span className="w-5 h-5 rounded-lg bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                          {name[0].toUpperCase()}
                        </span>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Form */}
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.44 }}
                className="space-y-6"
              >
                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearError();
                      }}
                      placeholder="doctor@clinic.com"
                      className="h-[52px] pl-11 rounded-xl bg-background border-border focus-visible:ring-primary/30 text-sm"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-foreground"
                    >
                      Password
                    </Label>
                    <button
                      type="button"
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearError();
                      }}
                      placeholder="••••••••"
                      className="h-[52px] pl-11 pr-12 rounded-xl bg-background border-border focus-visible:ring-primary/30 text-sm"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember */}
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="remember"
                    defaultChecked
                    className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground cursor-pointer select-none"
                  >
                    Keep me signed in
                  </label>
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2.5 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "w-full rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2",
                    "h-[52px]",
                    "bg-primary hover:opacity-90 active:scale-[0.98] transition-all",
                    isLoading && "opacity-70 cursor-not-allowed",
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </motion.form>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-8">
              © 2025 Neeraj Dental Clinic · All rights reserved
            </p>
          </div>
        </motion.div>

        {/* ═══ RIGHT — image (hero on mobile, split on desktop) ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="order-1 lg:order-2 relative overflow-hidden min-h-[220px] sm:min-h-[280px] lg:min-h-screen"
        >
          <div className="absolute inset-0 bg-muted" />

          {/* Image */}
          <div className="absolute inset-0 flex items-center justify-center p-5 sm:p-8 lg:p-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
              className="relative w-full max-w-xl h-[200px] sm:h-[260px] lg:h-auto lg:aspect-3/4 rounded-3xl overflow-hidden border border-white/70 shadow-lg"
            >
              <img
                src="https://i.pinimg.com/1200x/cb/fa/2e/cbfa2e0b657bdedb368f5789232a8efa.jpg"
                alt="Dental clinic"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
