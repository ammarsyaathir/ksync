'use client';
import { useState, useEffect } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([
    { id: 1, full_name: 'Aina Zahra', message: 'Hi everyone! Who is going to Zone A standing?', is_me: false },
    { id: 2, full_name: 'Danial Hakim', message: 'Hey Aina! I will be there at 3 PM for merchandise line!', is_me: false }
  ]);
  const [text, setText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const newMsg = { id: Date.now(), full_name: 'You', message: text.trim(), is_me: true };
    setMessages(prev => [...prev, newMsg]);
    setText('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-slate-100">
      <div className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 flex-shrink-0">
        <div>
          <h1 className="text-sm font-bold text-slate-900">Event Buddy Group Chat</h1>
          <p className="text-[10px] text-pink-600 font-semibold">BLACKPINK World Tour KL 2026</p>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 me-1.5 animate-pulse"></span> Live Chat
        </span>
      </div>

      <div className="flex-grow p-4 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.is_me ? 'items-end' : 'items-start'}`}>
            <span className="text-[10px] text-slate-400 font-semibold mb-1 px-1">{msg.full_name}</span>
            <div className={`max-w-[75%] p-3 rounded-2xl text-xs font-medium ${msg.is_me ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'}`}>
              {msg.message}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2 flex-shrink-0">
        <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="Type a message..."
               className="flex-grow bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-xs font-medium" />
        <button type="submit" className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs">
          Send <i className="fas fa-paper-plane ms-1"></i>
        </button>
      </form>
    </div>
  );
}
