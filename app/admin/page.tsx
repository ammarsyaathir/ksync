'use client';
import { useState } from 'react';

export default function AdminPage() {
  const [organizers, setOrganizers] = useState([
    { id: 1, full_name: 'Blink Malaysia Fanclub', email: 'blink_my@gmail.com', org_name: 'BLACKPINK Fanclub MY', verified: false },
    { id: 2, full_name: 'STAY Malaysia', email: 'stay_my@gmail.com', org_name: 'Stray Kids Fanclub MY', verified: true }
  ]);

  const handleVerify = (id: number) => {
    setOrganizers(prev => prev.map(o => o.id === id ? { ...o, verified: true } : o));
    alert("Organizer verified successfully!");
  };

  return (
    <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center">
          <i className="fas fa-shield-check text-pink-500 me-2"></i> Organizer Verifications & Approvals
        </h2>
      </div>

      <div className="space-y-4">
        {organizers.map(org => (
          <div key={org.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-base font-bold text-slate-900">{org.full_name}</h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${org.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {org.verified ? 'Verified' : 'Pending Review'}
                </span>
              </div>
              <p className="text-xs text-slate-500">{org.email} • {org.org_name}</p>
            </div>
            {!org.verified && (
              <button onClick={() => handleVerify(org.id)} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all">
                Approve Verification
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
