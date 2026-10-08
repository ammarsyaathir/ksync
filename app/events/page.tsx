'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchEvents = (query = '') => {
    setLoading(true);
    fetch(`/api/events?search=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success') {
          setEvents(result.data || []);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents(search);
  };

  return (
    <div className="flex flex-col flex-grow">
      <section className="bg-white border-b border-slate-200 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Discover K-Pop Events in Malaysia</h1>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-grow relative">
              <i className="fas fa-search absolute left-4 top-3.5 text-slate-400 text-sm"></i>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                     placeholder="Search by artist, event name, city or venue..."
                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
            <button type="submit" className="px-6 py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs transition-all">Filter Results</button>
          </form>
        </div>
      </section>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-4 border border-slate-200 animate-pulse h-80"></div>
            <div className="bg-white rounded-3xl p-4 border border-slate-200 animate-pulse h-80"></div>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev) => (
              <div key={ev.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img src={ev.poster_url || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=600&q=80'} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-pink-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">{ev.category_name || 'Concert'}</div>
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold text-pink-600 mb-1"><i className="fas fa-music me-1.5"></i> {ev.artist_name || 'K-Pop Artist'}</p>
                    <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-1">{ev.event_name}</h3>
                    <p className="text-xs text-slate-500 mb-4"><i className="far fa-calendar me-1"></i> {new Date(ev.event_date).toLocaleDateString('en-MY')}</p>
                  </div>
                  <Link href={`/events/${ev.id}`} className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs text-center block">View Event Details</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-700">No Events Found</h3>
          </div>
        )}
      </main>
    </div>
  );
}
