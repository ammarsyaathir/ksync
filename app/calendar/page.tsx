'use client';

export default function CalendarPage() {
  const events = [
    { date: '28 Oct 2026', title: 'TWICE Ready To Be Fanmeet KL', category: 'Fan Meeting' },
    { date: '15 Nov 2026', title: 'BLACKPINK World Tour in KL 2026', category: 'Concert' },
    { date: '05 Dec 2026', title: 'Stray Kids World Tour Malaysia', category: 'Concert' }
  ];

  return (
    <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <i className="far fa-calendar-alt text-pink-500 me-2"></i> K-Pop Malaysia Event Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Upcoming concert dates and fan meetups calendar</p>
        </div>
      </div>

      <div className="space-y-4">
        {events.map((ev, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-pink-50 text-pink-600 p-3 rounded-2xl text-center min-w-[90px]">
                <span className="text-xs font-bold block uppercase">{ev.date.split(' ')[1]}</span>
                <span className="text-xl font-black">{ev.date.split(' ')[0]}</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{ev.title}</h3>
                <span className="inline-block bg-pink-100 text-pink-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-1">{ev.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
