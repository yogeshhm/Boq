import React from 'react';
import { HardHat } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center gap-4 mb-8">
      <div className="p-3 bg-orange-500 rounded-2xl shadow-lg shadow-orange-200">
        <HardHat className="text-white" size={28} />
      </div>
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Buildacre BOQ</h1>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Construction Project Manager</p>
      </div>
    </header>
  );
}