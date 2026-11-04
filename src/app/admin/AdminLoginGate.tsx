"use client";

import { useState } from "react";
import { Lock, Shield, ArrowRight, AlertCircle } from "lucide-react";

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
    <div className="py-20 flex items-center justify-center text-[#EEF0EB]">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-[#181E19] rounded-xl border border-[#2B352E] p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-lg bg-[#2D6A54] text-white flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#EEF0EB]">
              Admin Fleet Console
            </h1>
            <p className="text-xs text-[#8E9991]">
              Enter your admin password to manage cars, visibility, and regional fleet controls.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-md bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-[#EEF0EB] block">
                Admin Master Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full h-11 px-3 bg-[#101411] border border-[#2B352E] rounded-md text-[#EEF0EB] focus:outline-none focus:border-[#387F66]"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-md bg-[#2D6A54] hover:bg-[#387F66] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Shield className="w-4 h-4" />
              <span>{loading ? "Verifying..." : "Unlock Admin Console"}</span>
            </button>
          </form>

          <div className="pt-3 border-t border-[#2B352E] text-[11px] text-[#8E9991] text-center">
            Configurable in <code className="bg-[#101411] px-1.5 py-0.5 rounded font-mono text-[#EEF0EB]">.env</code> under <code className="font-mono font-semibold">ADMIN_PASSWORD</code>.
          </div>
        </div>
      </div>
    </div>
  );
}
