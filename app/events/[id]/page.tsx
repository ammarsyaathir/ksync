'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<any>(null);
  const [interestCount, setInterestCount] = useState(0);

  useEffect(() => {
    // Sample event details fallback or fetch from API
    setEvent({
      id: params.id,
      event_name: 'BLACKPINK World Tour in KL 2026',
      artist_name: 'BLACKPINK',
      category_name: 'Concert',
      event_date: '2026-11-15',
      start_time: '20:00',
      end_time: '23:00',
      venue_name: 'National Stadium Bukit Jalil',
      transit_info: 'LRT Bukit Jalil Station (5 min walk)',
      description: 'Official BLACKPINK World Tour concert in Kuala Lumpur, Malaysia.',
      poster_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=600&q=80',
      is_verified: true
    });
    setInterestCount(1420);
  }, [params.id]);

  const handleToggleInterest = () => {
    setInterestCount(prev => prev + 1);
    alert("❤️ Marked as Interested! Updated live.");
  };

  if (!event) return <div className="p-8 text-center text-xs font-bold text-slate-500">Loading...</div>;

  return (
    <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-10">
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
          <div>
            <img src={event.poster_url} alt={event.event_name} className="w-full h-auto rounded-2xl object-cover shadow-md" />
          </div>
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <span className="bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1 rounded-full">{event.category_name}</span>
                {event.is_verified && (
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center">
                    <i className="fas fa-check-circle me-1"></i> Verified Organizer
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">{event.event_name}</h1>
              <p className="text-sm font-bold text-pink-600 mb-4 flex items-center">
                <i className="fas fa-music me-1.5"></i> {event.artist_name}
              </p>

              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 font-medium mb-6">
                <p><i className="far fa-calendar text-pink-500 me-2"></i> <strong>Date:</strong> {event.event_date}</p>
                <p><i className="far fa-clock text-pink-500 me-2"></i> <strong>Time:</strong> {event.start_time} - {event.end_time}</p>
                <p><i className="fas fa-location-dot text-pink-500 me-2"></i> <strong>Venue:</strong> {event.venue_name}</p>
                <p><i className="fas fa-train text-pink-500 me-2"></i> <strong>Transit:</strong> {event.transit_info}</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <button onClick={handleToggleInterest}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-pink-500/20 transition-all flex items-center justify-center space-x-2">
                <i className="fas fa-heart"></i>
                <span>I'm Interested ({interestCount})</span>
              </button>
              <Link href={`/buddies?event_id=${event.id}`}
                    className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs text-center transition-all block">
                <i className="fas fa-user-group me-1.5 text-pink-500"></i> Find Event Buddies Going To This Event
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
