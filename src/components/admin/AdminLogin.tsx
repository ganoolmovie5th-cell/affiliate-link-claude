"use client";

import { useState } from "react";

interface Props {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 500));
    const correct = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
    if (password === correct) {
      onLogin();
    } else {
      setError("Password salah. Coba lagi.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">Masukkan password untuk lanjut</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password admin"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? "Memeriksa..." : "Masuk"}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">
          Default password: <code className="bg-gray-100 px-1.5 py-0.5 rounded">admin123</code>
          <br />
          Ganti di file <code className="bg-gray-100 px-1.5 py-0.5 rounded">.env.local</code>
        </p>
      </div>
    </div>
  );
}
