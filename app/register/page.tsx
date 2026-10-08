'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [role, setRole] = useState('Fan');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Account created successfully for ${fullName} as ${role}!`);
    window.location.href = '/login';
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12 w-full flex-grow">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-3 shadow-md shadow-pink-500/20">
            <i className="fas fa-user-plus"></i>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Join K-Sync Malaysia</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Create your account to discover, save, or submit K-Pop events.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Account Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setRole('Fan')} className={`p-3 rounded-xl border flex items-center space-x-2 text-left ${role === 'Fan' ? 'border-pink-500 bg-pink-50' : 'border-slate-200 bg-slate-50'}`}>
                <div>
                  <p className="text-xs font-bold text-slate-900">K-Pop Fan</p>
                  <p className="text-[10px] text-slate-500">Discover & Save Events</p>
                </div>
              </button>
              <button type="button" onClick={() => setRole('Organizer')} className={`p-3 rounded-xl border flex items-center space-x-2 text-left ${role === 'Organizer' ? 'border-pink-500 bg-pink-50' : 'border-slate-200 bg-slate-50'}`}>
                <div>
                  <p className="text-xs font-bold text-slate-900">Event Organizer</p>
                  <p className="text-[10px] text-slate-500">Submit & Manage Events</p>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Nur Aina Zahra" className="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@domain.com" className="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium" />
          </div>

          <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white font-bold text-sm shadow-md shadow-pink-500/20">
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-600 font-medium">
          Already registered? <Link href="/login" className="text-pink-600 font-bold hover:underline">Log In</Link>
        </div>
      </div>
    </div>
  );
}
