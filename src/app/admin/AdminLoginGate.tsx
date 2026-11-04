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
    <div className="py-20 flex items-center justify-center bg-[#0D1117] min-h-[70vh]">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-[#161B22] rounded-2xl p-7 sm:p-8 shadow-xl space-y-6 text-[#F0F6FC] border border-[#30363D]">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.05] p-2 border border-[#30363D] flex items-center justify-center mx-auto shadow-md overflow-hidden">
              <img src="/logo.png" alt="abhicargo logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="font-display text-2xl font-extrabold text-white">
              Admin Dashboard
            </h1>
            <p className="text-xs text-[#9CA3AF] max-w-xs mx-auto">
              Enter your master password to manage cars, availability, and bookings.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-[#2D1515] border border-red-800 text-red-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="admin-master-password" className="font-bold text-[#C9D1D9] block text-xs">
                Admin Master Password
              </label>
              <input
                id="admin-master-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full h-11 px-3 clean-input rounded-lg text-white placeholder-[#6E7681] text-sm"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-[#C63832] hover:bg-[#E03E36] text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C63832]"
            >
              <Shield className="w-4 h-4" />
              <span>{loading ? "Verifying..." : "Unlock Admin Console"}</span>
            </button>
          </form>

          <div className="pt-3 border-t border-[#30363D] text-[11px] text-[#8B949E] text-center">
            abhicargo internal operations access.
          </div>
        </div>
      </div>
    </div>
  );
}
