'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSupabaseGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/login' }
      });
      if (error) throw error;
    } catch (err: any) {
      alert("Supabase Auth Error: " + err.message);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Logged in successfully as ${email}!`);
    window.location.href = '/';
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 w-full flex-grow">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-3 shadow-md shadow-pink-500/20">
            <i className="fas fa-lock"></i>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Log In to K-Sync</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Access event tracking, saved events & Event Buddy chat.</p>
        </div>

        <div className="mb-6">
          <button type="button" onClick={handleSupabaseGoogle} className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300 shadow-sm transition-all flex items-center justify-center">
            <i className="fas fa-bolt text-emerald-600 me-2 text-sm"></i> Continue with Supabase Auth
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="fan@ksync.my / organizer@ksync.my" className="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm font-medium" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm font-medium" />
          </div>
          <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white font-bold text-sm shadow-md shadow-pink-500/20">Sign In</button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-600 font-medium">
          Don't have an account? <Link href="/register" className="text-pink-600 font-bold hover:underline">Register Now</Link>
        </div>
      </div>
    </div>
  );
}
