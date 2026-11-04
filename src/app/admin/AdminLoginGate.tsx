"use client";

import { useState } from "react";
import { Lock, Shield, AlertCircle } from "lucide-react";

export function AdminLoginGate() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Incorrect admin password.");
      } else {
        window.location.reload();
      }
    } catch {
      setErrorMsg("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 flex items-center justify-center bg-[#0E1216] min-h-[70vh] relative">
      <div className="ambient-glow-red" />
      <div className="max-w-md w-full mx-auto px-4 relative z-10">
        <div className="glass-panel rounded-2xl p-8 shadow-2xl space-y-6 text-[#F1F4F7] border border-white/10">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C63832] to-[#9B1E19] text-white flex items-center justify-center mx-auto shadow-lg shadow-red-950/50 border border-white/10">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-display text-2xl font-extrabold text-white">
              Admin Fleet Console
            </h1>
            <p className="text-xs text-[#8F9CA8]">
              Enter your master password to manage cars, toggle public website visibility, and control fleet settings.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-white block">
                Admin Master Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full h-11 px-3 glass-input rounded-xl text-white"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C63832] to-[#B02E28] hover:from-[#E03E36] hover:to-[#C63832] text-white text-xs font-bold transition-all shadow-md shadow-red-950/40 border border-red-400/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>{loading ? "Verifying..." : "Unlock Admin Console"}</span>
            </button>
          </form>

          <div className="pt-3 border-t border-[#242D35] text-[11px] text-[#8F9CA8] text-center">
            AbhigoCar secure operations access.
          </div>
        </div>
      </div>
    </div>
  );
}
