'use client';
import EventCard from '@/components/EventCard';

export default function SavedEventsPage() {
  const savedEvents = [
    {
      id: 1,
      title: 'BLACKPINK World Tour in KL 2026',
      artist: 'BLACKPINK',
      category: 'Concert',
      date: '15 Nov 2026',
      venue: 'National Stadium Bukit Jalil',
      city: 'Kuala Lumpur',
      posterUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=600&q=80',
      isVerified: true
    },
    {
      id: 2,
      title: 'Stray Kids World Tour Malaysia',
      artist: 'Stray Kids',
      category: 'Concert',
      date: '05 Dec 2026',
      venue: 'Axiata Arena',
      city: 'Kuala Lumpur',
      posterUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
      isVerified: true
    }
  ];

  return (
    <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <i className="fas fa-bookmark text-pink-500 me-2"></i> Your Saved & Tracked Events
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Quick access to your bookmarked K-Pop concerts and fan meets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedEvents.map(ev => (
          <EventCard key={ev.id} {...ev} />
        ))}
      </div>
    </main>
  );
}
