'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-pink-500/20">
              K
            </div>
            <div>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent">K-Sync</span>
              <span className="text-xs font-semibold text-slate-400 block -mt-1">Malaysia</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-bold text-pink-600 hover:text-pink-700">Home</Link>
            <Link href="/events" className="text-sm font-medium text-slate-600 hover:text-pink-600 transition-colors">Discover Events</Link>
            <Link href="/buddies" className="text-sm font-medium text-slate-600 hover:text-pink-600 transition-colors flex items-center">
              <i class="fas fa-user-group me-1.5 text-pink-500"></i> Event Buddy
            </Link>
            <Link href="/submit-event" className="text-sm font-medium text-slate-600 hover:text-pink-600 transition-colors">Submit Event</Link>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/login" className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all">
              Log In
            </Link>
            <Link href="/submit-event" className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-pink-500/20 transition-all">
              <i class="fas fa-plus me-1"></i> Add Event
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
