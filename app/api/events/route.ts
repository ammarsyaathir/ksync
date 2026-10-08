import { NextResponse } from 'next/server';

const sampleEvents = [
  {
    id: 1,
    event_name: 'BLACKPINK World Tour in KL 2026',
    artist_name: 'BLACKPINK',
    category_name: 'Concert',
    event_date: '2026-11-15',
    venue_name: 'National Stadium Bukit Jalil',
    city: 'Kuala Lumpur',
    poster_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=600&q=80',
    interest_count: 1420
  },
  {
    id: 2,
    event_name: 'Stray Kids World Tour Malaysia 2026',
    artist_name: 'Stray Kids',
    category_name: 'Concert',
    event_date: '2026-12-05',
    venue_name: 'Axiata Arena',
    city: 'Kuala Lumpur',
    poster_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    interest_count: 980
  },
  {
    id: 3,
    event_name: 'TWICE Ready To Be Fanmeet KL',
    artist_name: 'TWICE',
    category_name: 'Fan Meeting',
    event_date: '2026-10-28',
    venue_name: 'Mega Star Arena',
    city: 'Kuala Lumpur',
    poster_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    interest_count: 750
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase() || '';

  let filtered = sampleEvents;
  if (search) {
    filtered = sampleEvents.filter(ev =>
      ev.event_name.toLowerCase().includes(search) ||
      ev.artist_name.toLowerCase().includes(search) ||
      ev.city.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({ status: 'success', data: filtered });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newEvent = {
    id: Date.now(),
    ...body,
    verification_status: 'VERIFIED',
    interest_count: 1
  };
  sampleEvents.push(newEvent);
  return NextResponse.json({ status: 'success', message: 'Event submitted successfully!', data: newEvent });
}
