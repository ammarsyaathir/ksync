// src/templates.js - Native HTML Pages for Cloudflare Workers (Zero KV Manifest Dependency)

export const indexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>K-Sync Malaysia | K-Pop Event Tracker & Community</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-slate-50 text-slate-800 flex flex-col min-h-screen">
    <nav class="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <a href="/" class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-pink-500/20">K</div>
                    <div>
                        <span class="text-lg font-black tracking-tight bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent">K-Sync</span>
                        <span class="text-xs font-semibold text-slate-400 block -mt-1">Malaysia</span>
                    </div>
                </a>
                <div class="hidden md:flex items-center space-x-6">
                    <a href="/" class="text-sm font-bold text-pink-600">Home</a>
                    <a href="/events.html" class="text-sm font-medium text-slate-600 hover:text-pink-600 transition-colors">Discover Events</a>
                    <a href="/buddies.html" class="text-sm font-medium text-slate-600 hover:text-pink-600 transition-colors flex items-center">
                        <i class="fas fa-user-group me-1.5 text-pink-500"></i> Event Buddy
                    </a>
                    <a href="/submit-event.html" class="text-sm font-medium text-slate-600 hover:text-pink-600 transition-colors">Submit Event</a>
                </div>
                <div class="flex items-center space-x-3">
                    <a href="/login.html" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all">Log In</a>
                    <a href="/submit-event.html" class="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white font-bold text-xs shadow-md shadow-pink-500/20">
                        <i class="fas fa-plus me-1"></i> Add Event
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <section class="relative bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white py-16 px-4 overflow-hidden">
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
            <form action="/events.html" method="GET" class="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 max-w-2xl mx-auto flex items-center space-x-2">
                <div class="flex-grow flex items-center px-3 text-slate-300">
                    <i class="fas fa-search me-2 text-pink-400"></i>
                    <input type="text" name="search" placeholder="Search artist, concert name, city or venue..."
                           class="w-full bg-transparent border-none text-white placeholder-slate-400 focus:outline-none text-sm font-medium">
                </div>
                <button type="submit" class="px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-md transition-all">
                    Search Events
                </button>
            </form>
        </div>
    </section>

    <main class="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div class="flex items-center justify-between mb-8">
            <div>
                <h2 class="text-2xl font-bold text-slate-900 flex items-center">
                    <i class="fas fa-fire text-pink-500 me-2"></i> Upcoming K-Pop Events
                </h2>
                <p class="text-xs text-slate-500 mt-1 font-medium">Verified concerts, fan meets, and gatherings across Malaysia</p>
            </div>
            <a href="/events.html" class="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center">
                View All Events <i class="fas fa-arrow-right ms-1"></i>
            </a>
        </div>
        <div id="events-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white rounded-3xl p-4 border border-slate-200 animate-pulse h-80"></div>
            <div class="bg-white rounded-3xl p-4 border border-slate-200 animate-pulse h-80"></div>
            <div class="bg-white rounded-3xl p-4 border border-slate-200 animate-pulse h-80"></div>
        </div>
    </main>

    <footer class="bg-white border-t border-slate-200 py-8 mt-auto text-center text-slate-500 text-xs font-medium">
        <p>© 2026 K-Sync Malaysia. Final Year Project - K-Pop Event Tracking System.</p>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', fetchEvents);
        async function fetchEvents() {
            const container = document.getElementById('events-grid');
            try {
                const res = await fetch('/api/events');
                const result = await res.json();
                if (result.status === 'success' && result.data.length > 0) {
                    renderEvents(result.data);
                } else {
                    container.innerHTML = \`<div class="col-span-full text-center py-12 bg-white rounded-3xl border border-slate-200"><h3 class="text-base font-bold text-slate-700">No Upcoming Events Found</h3><a href="/submit-event.html" class="inline-block mt-4 px-4 py-2 rounded-xl bg-pink-500 text-white font-bold text-xs">Submit Event</a></div>\`;
                }
            } catch (err) {
                container.innerHTML = \`<div class="col-span-full text-center py-8 bg-rose-50 text-rose-700 rounded-2xl border border-rose-200 text-xs font-bold">Unable to load events from Cloudflare Workers API.</div>\`;
            }
        }
        function renderEvents(events) {
            const container = document.getElementById('events-grid');
            container.innerHTML = events.map(ev => \`
                <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
                    <div class="relative h-48 bg-slate-100 overflow-hidden">
                        <img src="\${ev.poster_url || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=600&q=80'}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                        <div class="absolute top-3 left-3 bg-pink-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">\${ev.category_name || 'Concert'}</div>
                    </div>
                    <div class="p-5 flex-grow flex flex-col justify-between">
                        <div>
                            <p class="text-xs font-bold text-pink-600 mb-1"><i class="fas fa-music me-1.5"></i> \${ev.artist_name || 'K-Pop Artist'}</p>
                            <h3 class="text-base font-bold text-slate-900 mb-2 line-clamp-1">\${ev.event_name}</h3>
                            <p class="text-xs text-slate-500 mb-4"><i class="far fa-calendar me-1"></i> \${new Date(ev.event_date).toLocaleDateString('en-MY')}</p>
                        </div>
                        <a href="/event-details.html?id=\${ev.id}" class="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs text-center">View Event Details</a>
                    </div>
                </div>
            \`).join('');
        }
    </script>
</body>
</html>`;
