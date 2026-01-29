'use client';
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Terminal, Server as ServerIcon, Cpu, LogOut, Plus, Trash2, ShieldCheck } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [form, setForm] = useState({ name: '', node: '20', ram: '1024MB' });

  // Load Data Server
  useEffect(() => {
    if (session) refreshData();
  }, [session]);

  const refreshData = async () => {
    const res = await fetch('/api/panel');
    const json = await res.json();
    if (json.success) setServers(json.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/panel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, owner: session.user.name })
    });
    setForm({ name: '', node: '20', ram: '1024MB' }); // Reset form
    setLoading(false);
    refreshData();
  };

  const handleDelete = async (id) => {
    if(!confirm("Hapus server ini?")) return;
    await fetch(`/api/panel?id=${id}`, { method: 'DELETE' });
    refreshData();
  };

  // --- HALAMAN LOGIN (Jika belum login) ---
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4 font-sans text-gray-200">
        <div className="max-w-md w-full bg-[#161b22] border border-gray-800 rounded-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-blue-500 tracking-tighter">ZILDX PANEL</h1>
            <p className="text-gray-500 text-sm mt-2">Professional Server Management</p>
          </div>
          
          <div className="space-y-4">
             <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded text-sm text-blue-400 text-center">
                Silahkan Login Menggunakan Akun Owner
             </div>
             <button 
               onClick={() => signIn(null, { callbackUrl: '/' })}
               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition"
             >
               LOGIN SEKARANG
             </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-600">Owner: ZILDJIAN | Bot: V1-XYZ PRO</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "loading") return <div className="bg-[#0d1117] h-screen text-white flex items-center justify-center">Loading ZILDX...</div>;

  // --- HALAMAN DASHBOARD (Jika sudah login) ---
  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-300 font-sans">
      {/* Navbar */}
      <nav className="bg-[#161b22] border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded text-white font-bold tracking-widest">ZILDX</div>
          <span className="hidden md:block font-semibold text-gray-400">/ DASHBOARD</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm text-white font-bold">{session.user.name}</p>
            <p className="text-xs text-blue-400">Owner Access</p>
          </div>
          <button onClick={() => signOut()} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-2 rounded transition">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Form Create */}
        <div className="lg:col-span-1">
          <div className="bg-[#161b22] rounded-xl border border-gray-800 p-5 sticky top-24">
            <h3 className="text-white font-bold flex items-center gap-2 mb-4">
              <Plus size={18} className="text-blue-500"/> Create Server
            </h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Server Name</label>
                <input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full bg-[#0d1117] border border-gray-700 rounded p-2 text-white text-sm focus:border-blue-500 outline-none mt-1" placeholder="Nama Server..." />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Nest / Node Vers.</label>
                <select value={form.node} onChange={e=>setForm({...form, node: e.target.value})} className="w-full bg-[#0d1117] border border-gray-700 rounded p-2 text-white text-sm outline-none mt-1">
                  <option value="16">NodeJS 16</option>
                  <option value="18">NodeJS 18</option>
                  <option value="20">NodeJS 20</option>
                  <option value="22">NodeJS 22</option>
                  <option value="25">NodeJS 25 (Nightly)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">RAM Allocation</label>
                <select value={form.ram} onChange={e=>setForm({...form, ram: e.target.value})} className="w-full bg-[#0d1117] border border-gray-700 rounded p-2 text-white text-sm outline-none mt-1">
                  <option value="1024MB">1 GB</option>
                  <option value="2048MB">2 GB</option>
                  <option value="4096MB">4 GB</option>
                  <option value="UNLIMITED">UNLIMITED</option>
                </select>
              </div>
              <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded transition flex justify-center">
                {loading ? 'Creating...' : 'Deploy Server'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-800">
               <div className="flex items-center gap-2 text-xs text-yellow-500 mb-2">
                 <ShieldCheck size={14}/> Premium Info
               </div>
               <p className="text-xs text-gray-500">Upgrade to premium (5K) via 6285183122570 (ZILDJIAN) for more resources.</p>
            </div>
          </div>
        </div>

        {/* Server List */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Active Servers ({servers.length})</h2>
          
          {servers.length === 0 && (
            <div className="text-center py-20 bg-[#161b22] rounded-xl border border-gray-800 border-dashed">
              <ServerIcon size={40} className="mx-auto text-gray-700 mb-4"/>
              <p className="text-gray-500">No servers found. Create one on the left.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {servers.map((srv) => (
              <div key={srv._id} className="bg-[#161b22] p-5 rounded-xl border border-gray-800 hover:border-blue-500/50 transition group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${srv.status === 'running' ? 'bg-green-500' : 'bg-red-500'} shadow-[0_0_10px_rgba(239,68,68,0.5)]`}></div>
                    <h3 className="font-bold text-white text-lg">{srv.name}</h3>
                  </div>
                  <button onClick={() => handleDelete(srv._id)} className="text-gray-600 hover:text-red-500 transition"><Trash2 size={18}/></button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#0d1117] p-2 rounded border border-gray-800 flex items-center gap-2 text-xs text-gray-400">
                    <Cpu size={14} className="text-blue-500"/> Node v{srv.node}
                  </div>
                  <div className="bg-[#0d1117] p-2 rounded border border-gray-800 flex items-center gap-2 text-xs text-gray-400">
                    <Terminal size={14} className="text-green-500"/> {srv.ram}
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-xs py-2 rounded text-white font-medium transition">
                    Console
                  </button>
                  <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-xs py-2 rounded text-white font-medium transition">
                    File Manager
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
