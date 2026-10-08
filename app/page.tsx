'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success') {
          setEvents(result.data || []);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col flex-grow">
      {/* HERO BANNER */}
      <section className="relative bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white py-16 px-4 overflow-hidden">
        <div class="max-w-4xl mx-auto text-center relative z-10">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold mb-4">
            <i class="fas fa-sparkles text-pink-400"></i> Official K-Pop Concert & Fan Tracker in Malaysia
          </span>
          <h1 class="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            Never Miss a <span class="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">K-Pop Concert</span> or Fan Gathering Again.
          </h1>
          <p class="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 font-medium">
            Track verified concerts, cup-sleeve events, fan meetups, and find concert buddies across Malaysia.
          </p>

          <form action="/events" method="GET" class="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 max-w-2xl mx-auto flex items-center space-x-2">
            <div class="flex-grow flex items-center px-3 text-slate-300">
              <i class="fas fa-search me-2 text-pink-400"></i>
              <input type="text" name="search" placeholder="Search artist, concert name, city or venue..."
                     class="w-full bg-transparent border-none text-white placeholder-slate-400 focus:outline-none text-sm font-medium" />
            </div>
            <button type="submit" class="px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-md transition-all">
              Search Events
            </button>
          </form>
        </div>
      </section>

      {/* EVENTS GRID */}
      <main class="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold text-slate-900 flex items-center">
              <i class="fas fa-fire text-pink-500 me-2"></i> Upcoming K-Pop Events
            </h2>
            <p class="text-xs text-slate-500 mt-1 font-medium">Verified concerts, fan meets, and gatherings across Malaysia</p>
          </div>
          <Link href="/events" class="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center">
            View All Events <i class="fas fa-arrow-right ms-1"></i>
          </Link>
        </div>

        {loading ? (
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-3xl p-4 border border-slate-200 animate-pulse h-80"></div>
            <div class="bg-white rounded-3xl p-4 border border-slate-200 animate-pulse h-80"></div>
            <div class="bg-white rounded-3xl p-4 border border-slate-200 animate-pulse h-80"></div>
          </div>
        ) : events.length > 0 ? (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev) => (
              <div key={ev.id} class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
                <div class="relative h-48 bg-slate-100 overflow-hidden">
                  <img src={ev.poster_url || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=600&q=80'} 
                       alt={ev.event_name} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div class="absolute top-3 left-3 bg-pink-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                    {ev.category_name || 'Concert'}
                  </div>
                </div>
                <div class="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <p class="text-xs font-bold text-pink-600 mb-1 flex items-center">
                      <i class="fas fa-music me-1.5"></i> {ev.artist_name || 'K-Pop Artist'}
                    </p>
                    <h3 class="text-base font-bold text-slate-900 group-hover:text-pink-600 transition-colors line-clamp-1 mb-2">
                      {ev.event_name}
                    </h3>
                    <p class="text-xs text-slate-500 mb-4 flex items-center">
                      <i class="far fa-calendar text-slate-400 me-1"></i> {new Date(ev.event_date).toLocaleDateString('en-MY')}
                    </p>
                  </div>
                  <Link href={`/events/${ev.id}`} class="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-pink-50 hover:text-pink-600 text-slate-700 font-bold text-xs text-center transition-all block">
                    View Event Details <i class="fas fa-chevron-right ms-1 text-[10px]"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div class="text-center py-12 bg-white rounded-3xl border border-slate-200">
            <h3 class="text-base font-bold text-slate-700">No Upcoming Events Found</h3>
            <Link href="/submit-event" class="inline-block mt-4 px-4 py-2 rounded-xl bg-pink-500 text-white font-bold text-xs">
              Submit Event
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
