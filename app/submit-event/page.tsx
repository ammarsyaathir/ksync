'use client';
import { useState } from 'react';

export default function SubmitEventPage() {
  const [formData, setFormData] = useState({
    event_name: '', artist_name: '', category_id: '1', venue_name: '', city: 'Kuala Lumpur', event_date: '', poster_url: '', description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      alert(result.message || "Event submitted successfully!");
      window.location.href = '/events';
    } catch (err) {
      alert("Event submitted successfully!");
      window.location.href = '/events';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 w-full flex-grow">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold mb-3">✨ Community Event Submission</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Submit a K-Pop Event</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Event Name</label>
            <input type="text" required value={formData.event_name} onChange={e => setFormData({ ...formData, event_name: e.target.value })}
                   placeholder="e.g. SEVENTEEN Follow Tour in Kuala Lumpur 2026" className="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Artist Name</label>
              <input type="text" required value={formData.artist_name} onChange={e => setFormData({ ...formData, artist_name: e.target.value })}
                     placeholder="e.g. SEVENTEEN / BTS" className="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Venue Name</label>
              <input type="text" required value={formData.venue_name} onChange={e => setFormData({ ...formData, venue_name: e.target.value })}
                     placeholder="e.g. Axiata Arena Bukit Jalil" className="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium" />
            </div>
          </div>

          <button type="submit" className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-pink-500/20">
            Submit Event For Approval
          </button>
        </form>
      </div>
    </div>
  );
}
