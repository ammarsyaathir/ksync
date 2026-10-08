'use client';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-12">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
        <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-slate-100">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
            <i className="fas fa-user"></i>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Nur Aina Zahra</h1>
            <p className="text-xs font-bold text-pink-600">aina@ksync.my</p>
            <span className="inline-block bg-pink-100 text-pink-700 text-[10px] font-bold px-3 py-1 rounded-full mt-2">K-Pop Fan</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/events" className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-pink-300 transition-all flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500">Tracked Events</p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Explore Concerts</h3>
            </div>
            <i className="fas fa-heart text-pink-500 text-2xl"></i>
          </Link>
          <Link href="/buddies" className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-pink-300 transition-all flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500">Event Buddies</p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">View Connections</h3>
            </div>
            <i className="fas fa-users text-indigo-500 text-2xl"></i>
          </Link>
        </div>
      </div>
    </main>
  );
}
