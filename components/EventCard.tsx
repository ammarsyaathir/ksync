import Link from 'next/link';

interface EventCardProps {
  id: string | number;
  title: string;
  artist: string;
  category: string;
  date: string;
  venue: string;
  city: string;
  posterUrl: string;
  isVerified?: boolean;
}

export default function EventCard({ id, title, artist, category, date, venue, city, posterUrl, isVerified }: EventCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        <img src={posterUrl || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=600&q=80'}
             alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-3 left-3 bg-pink-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
          {category}
        </div>
        {isVerified && (
          <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center">
            <i className="fas fa-check-circle me-1"></i> Verified
          </div>
        )}
      </div>
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <p className="text-xs font-bold text-pink-600 mb-1 flex items-center">
            <i className="fas fa-music me-1.5"></i> {artist}
          </p>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-pink-600 transition-colors line-clamp-1 mb-2">
            {title}
          </h3>
          <div className="space-y-1 text-xs text-slate-500 mb-4">
            <p className="flex items-center"><i className="far fa-calendar text-slate-400 w-4 me-1"></i> {date}</p>
            <p className="flex items-center"><i className="fas fa-location-dot text-slate-400 w-4 me-1"></i> {venue}, {city}</p>
          </div>
        </div>
        <Link href={`/events/${id}`} className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-pink-50 hover:text-pink-600 text-slate-700 font-bold text-xs text-center transition-all block">
          View Event Details <i className="fas fa-chevron-right ms-1 text-[10px]"></i>
        </Link>
      </div>
    </div>
  );
}
