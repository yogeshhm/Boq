import React from 'react';
import { Folder, Edit3 } from 'lucide-react';

export default function ProjectSidebar({ projects, onLoadProject }) {
  return (
    <div className="w-full md:w-72 bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-white h-fit">
      <h3 className="text-xs uppercase tracking-[0.2em] font-black text-slate-400 mb-6 px-2">Saved Projects</h3>
      <div className="space-y-3">
        {projects.length === 0 && <p className="text-slate-400 text-sm italic px-2">No projects yet.</p>}
        {projects.map((proj) => (
          <button
            key={proj.id}
            onClick={() => onLoadProject(proj)}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-orange-50 hover:text-orange-600 transition-all group text-left"
          >
            <div className="flex items-center gap-3">
              <Folder size={18} className="text-slate-400 group-hover:text-orange-500" />
              <div>
                <p className="font-bold text-sm truncate w-32">{proj.project_name}</p>
                <p className="text-[10px] text-slate-400">₹{proj.total_amount.toLocaleString()}</p>
              </div>
            </div>
            <Edit3 size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
}