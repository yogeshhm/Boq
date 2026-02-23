import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Calculator, HardHat, Trash2, Plus, Save, Folder, PlusCircle, Calendar, RotateCcw } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  const [materials, setMaterials] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    const { data: mats } = await supabase.from('materials').select('*');
    const { data: projs } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    setMaterials(mats || []);
    setProjects(projs || []);
  }

  const handleSave = async () => {
    if (!projectName) return alert("Please enter a Project Name first!");
    
    const payload = { 
      project_name: projectName, 
      items: selectedItems, 
      total_amount: selectedItems.reduce((a, c) => a + c.total, 0) 
    };
    
    if (currentId) {
      await supabase.from('projects').update(payload).eq('id', currentId);
    } else {
      await supabase.from('projects').insert([payload]);
    }
    fetchInitialData();
    alert("Saved successfully!");
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this project?")) {
      await supabase.from('projects').delete().eq('id', id);
      if (currentId === id) resetAll();
      fetchInitialData();
    }
  };

  const loadProject = (p) => {
    setCurrentId(p.id);
    setProjectName(p.project_name);
    setSelectedItems(p.items);
  };

  const resetAll = () => {
    setCurrentId(null);
    setProjectName('');
    setSelectedItems([]);
  };

  const updateItem = (id, field, value) => {
    setSelectedItems(selectedItems.map(item => {
      if (item.id === id) {
        const up = { ...item, [field]: value };
        if (field === 'category') { up.materialId = ''; up.total = 0; }
        if (field === 'materialId' || field === 'qty') {
          const mat = materials.find(m => m.id === (field === 'materialId' ? value : item.materialId));
          up.total = mat ? mat.price_per_unit * (field === 'qty' ? value : item.qty) : 0;
        }
        return up;
      }
      return item;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row p-4 md:p-8 gap-6 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-80 bg-white rounded-[2rem] p-6 shadow-xl border border-slate-200 h-fit md:h-[calc(100vh-64px)] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-slate-900 font-black text-lg">PROJECTS</h2>
          <button onClick={resetAll} className="text-orange-600 p-2 bg-orange-50 rounded-xl hover:bg-orange-100">
            <PlusCircle size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {projects.map((p) => (
            <div key={p.id} className="relative group">
              <button 
                onClick={() => loadProject(p)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${currentId === p.id ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
              >
                <p className="text-slate-900 font-bold text-sm truncate pr-6">{p.project_name}</p>
                <p className="text-slate-500 text-[10px] font-bold uppercase mt-1">₹{p.total_amount.toLocaleString()}</p>
              </button>
              <button onClick={() => handleDelete(p.id)} className="absolute right-3 top-4 text-slate-300 hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN CALCULATOR */}
      <main className="flex-1 bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-wrap justify-between items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Project Name</label>
            <input 
              className="w-full bg-transparent text-xl font-black text-slate-900 outline-none placeholder:text-slate-300"
              placeholder="Enter Project Name..."
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <button onClick={handleSave} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-600 transition-all">
            <Save size={18} /> {currentId ? 'UPDATE PROJECT' : 'SAVE PROJECT'}
          </button>
        </div>

        {/* List of Rows */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4 min-h-[400px]">
          {selectedItems.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 items-center">
              <div className="col-span-3">
                <select 
                  className="w-full p-3 rounded-xl bg-white text-slate-900 font-bold text-xs border border-slate-200"
                  value={item.category} 
                  onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                >
                  <option value="">CATEGORY</option>
                  {[...new Set(materials.map(m => m.category))].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="col-span-4">
                <select 
                  className="w-full p-3 rounded-xl bg-white text-slate-900 font-bold text-xs border border-slate-200 disabled:opacity-50"
                  disabled={!item.category}
                  value={item.materialId} 
                  onChange={(e) => updateItem(item.id, 'materialId', e.target.value)}
                >
                  <option value="">BRAND</option>
                  {materials.filter(m => m.category === item.category).map(m => (
                    <option key={m.id} value={m.id}>{m.brand} (₹{m.price_per_unit})</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <input 
                  type="number" 
                  className="w-full p-3 rounded-xl bg-white text-slate-900 font-bold text-xs border border-slate-200"
                  placeholder="QTY"
                  value={item.qty || ''} 
                  onChange={(e) => updateItem(item.id, 'qty', Number(e.target.value))}
                />
              </div>

              <div className="col-span-2 text-right">
                <p className="text-slate-400 text-[9px] font-black uppercase">Subtotal</p>
                <p className="text-slate-900 font-black text-sm">₹{item.total.toLocaleString()}</p>
              </div>

              <div className="col-span-1 text-right">
                <button onClick={() => setSelectedItems(selectedItems.filter(i => i.id !== item.id))} className="text-slate-300 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          <button 
            onClick={() => setSelectedItems([...selectedItems, { id: Date.now(), category: '', materialId: '', qty: 0, total: 0 }])}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:bg-slate-50 hover:text-slate-600 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} /> ADD MATERIAL ROW
          </button>
        </div>

        {/* Grand Total Footer */}
        <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
          <div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Grand Total Amount</p>
            <h2 className="text-4xl font-black italic">₹{selectedItems.reduce((a, c) => a + c.total, 0).toLocaleString()}</h2>
          </div>
          <button className="bg-orange-500 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-900/20">
            Print Quote
          </button>
        </div>
      </main>
    </div>
  );
}