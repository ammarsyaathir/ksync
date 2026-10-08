'use client';
import Link from 'next/link';

export default function BuddiesPage() {
  const buddies = [
    { id: 1, full_name: 'Aina Zahra', username: 'aina_blink', role: 'BLACKPINK Fan', city: 'Kuala Lumpur', event: 'BLACKPINK World Tour in KL 2026', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
    { id: 2, full_name: 'Danial Hakim', username: 'danial_stay', role: 'Stray Kids Fan', city: 'Petaling Jaya', event: 'Stray Kids World Tour Malaysia', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    { id: 3, full_name: 'Mei Ling', username: 'meiling_once', role: 'TWICE Fan', city: 'Subang Jaya', event: 'TWICE Ready To Be Tour KL', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' }
  ];

  return (
    <div className="flex flex-col flex-grow">
      <section className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold mb-3">
            🤝 K-Sync Event Buddy System
          </span>
          <h1 className="text-3xl font-black mb-2">Find Your K-Pop Concert Buddy</h1>
          <p className="text-xs sm:text-sm text-pink-100 max-w-xl mx-auto font-medium">
            Connect with fellow Malaysian K-Pop fans going to the same concert or fan gathering.
          </p>
        </div>
      </section>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <i className="fas fa-users text-pink-500 me-2"></i> K-Sync Fans Going to Events
          </h2>
          <span className="text-xs text-slate-500 font-medium">Showing {buddies.length} Active Buddies</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buddies.map((b) => (
            <div key={b.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center space-x-4 mb-4">
                <img src={b.img} className="w-14 h-14 rounded-2xl object-cover border-2 border-pink-500 shadow-sm" alt={b.full_name} />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{b.full_name}</h3>
                  <p className="text-xs text-pink-600 font-semibold">@{b.username} • {b.role}</p>
                  <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md mt-1">{b.city}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-600 mb-4">
                <p className="font-bold text-slate-800 mb-0.5"><i className="fas fa-ticket text-pink-500 me-1"></i> Going to:</p>
                <p className="line-clamp-1">{b.event}</p>
              </div>
              <Link href={`/buddies/chat?event_id=${b.id}`} className="w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs text-center transition-all block">
                <i className="fas fa-comments me-1"></i> Chat / Connect
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
