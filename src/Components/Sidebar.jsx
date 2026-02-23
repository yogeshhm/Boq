import React from 'react';
import { Folder, PlusCircle, Calendar } from 'lucide-react';

export default function Sidebar({ projects, onSelect, onNew, activeId }) {
  return (
    <div className="w-full md:w-80 bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-white h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center mb-6 px-2">
        <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Your Projects</h3>
        <button onClick={onNew} className="text-orange-500 hover:text-orange-600 transition-colors">
          <PlusCircle size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {projects.length === 0 && <p className="text-slate-400 text-sm italic px-2">No saved estimates.</p>}
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className={`w-full text-left p-4 rounded-2xl transition-all border ${
              activeId === p.id 
              ? 'bg-orange-50 border-orange-100 ring-1 ring-orange-200' 
              : 'bg-slate-50 border-transparent hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <Folder size={16} className={activeId === p.id ? 'text-orange-500' : 'text-slate-400'} />
              <p className="font-black text-sm text-slate-700 truncate">{p.project_name}</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                <Calendar size={10} /> {new Date(p.created_at).toLocaleDateString()}
              </span>
              <span className="text-xs font-black text-slate-900">₹{p.total_amount.toLocaleString()}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}