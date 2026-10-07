"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Lock, AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [secretInput, setSecretInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth");
        const data = await res.json();
        setIsAuthenticated(Boolean(data.authenticated));
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretInput.trim()) return;

    setIsAuthenticating(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: secretInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      setIsAuthenticated(true);
      setSecretInput("");
    } catch (err: any) {
      setAuthError(err.message || "Invalid admin secret key");
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
          <RefreshCw className="w-5 h-5 animate-spin text-[var(--primary)]" />
          <span>Verifying credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[var(--bg)]">
        <div className="bg-glow one pointer-events-none" />
        <div className="bg-glow two pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md relative z-10 border border-[var(--border)] rounded-3xl bg-[var(--surface)]/95 backdrop-blur-xl p-8 sm:p-10 shadow-2xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_var(--glow-strong)] text-white">
            <Shield className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-extrabold text-center text-[var(--text-bright)] tracking-tight mb-2">
            Admin Access Required
          </h1>
          <p className="text-sm text-center text-[var(--muted)] mb-8">
            Enter the admin passcode to access the Portfolio CMS & Management Dashboard.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="password"
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                placeholder="Enter ADMIN_SECRET..."
                required
                autoFocus
                className="w-full pl-11 pr-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-[var(--text)] placeholder-[var(--muted-2)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all text-sm"
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] hover:brightness-110 active:scale-[0.99] text-white font-semibold text-sm shadow-[0_4px_20px_var(--glow)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Unlock Admin Dashboard</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--border)] text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text-bright)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Portfolio</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
