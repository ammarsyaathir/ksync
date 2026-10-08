'use client';
import { useState } from 'react';

export default function CheckinPage() {
  const [checkedIn, setCheckedIn] = useState(false);

  const handleCheckin = () => {
    setCheckedIn(true);
    alert("🎉 Checked in successfully! Badge earned: 'BLACKPINK KL 2026 Concert Attendee'.");
  };

  return (
    <main className="flex-grow max-w-2xl mx-auto w-full px-4 py-12">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
        <div className="w-16 h-16 rounded-3xl bg-pink-100 text-pink-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
          <i className="fas fa-qrcode"></i>
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Event Check-In & Fan Badge</h1>
        <p className="text-xs text-slate-500 mb-6 font-medium">Verify your concert attendance on location to earn official fan badges.</p>

        {checkedIn ? (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-emerald-800">
            <i className="fas fa-certificate text-3xl text-emerald-600 mb-2"></i>
            <h3 className="text-base font-bold">Verified Attendee Badge</h3>
            <p className="text-xs text-emerald-600 mt-1">BLACKPINK World Tour in KL 2026</p>
          </div>
        ) : (
          <button onClick={handleCheckin} className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-pink-500/20">
            <i className="fas fa-location-crosshairs me-1.5"></i> Confirm Location Check-In
          </button>
        )}
      </div>
    </main>
  );
}
