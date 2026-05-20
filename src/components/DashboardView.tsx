import React from "react";
import { 
  Activity, 
  Clock, 
  MousePointer, 
  Keyboard, 
  ArrowUp, 
  ArrowDown, 
  Cpu, 
  PieChart as PieIcon, 
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Play,
  RotateCcw
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { DashboardMetrics } from "../types";

interface DashboardViewProps {
  metrics: DashboardMetrics;
  activityHistory: any[];
  ioHistory: any[];
}

export default function DashboardView({ metrics, activityHistory, ioHistory }: DashboardViewProps) {
  // Process activity data for productive vs unproductive bar chart
  const groupActivityByCategory = () => {
    const map: Record<string, number> = {};
    activityHistory.forEach(item => {
      const parent = item.category || "General";
      map[parent] = (map[parent] || 0) + item.duration / 60; // minutes
    });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value: Math.round(value)
    }));
  };

  const chartData = ioHistory.map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    keystrokes: item.keystrokes,
    clicks: item.clicks,
    wpm: item.typingSpeed || 0
  })).slice(-12); // Last 12 intervals

  const categoryData = groupActivityByCategory();

  return (
    <div className="space-y-6 text-slate-350">
      {/* Top Banner Alert Matrix */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-[#0A0D14] text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Activity className="h-5 w-5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <h4 className="font-display font-medium text-white text-sm tracking-wide uppercase">System Telemetry Live Signal</h4>
            <p className="text-slate-400 text-xs">Windows event loop hook and local daemon connection established in loopback model.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></span>
          <span className="text-cyan-400 text-xs font-mono tracking-widest uppercase">● ESTABLISHED_SECURE</span>
        </div>
      </div>

      {/* Grid of Key Performance Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Focus Score Card */}
        <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl backdrop-blur-sm flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Productivity Intensity</span>
            <TrendingUp className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-white tracking-tight">{metrics.focusScore}%</span>
            <span className="text-green-500 text-xs font-mono">+12%</span>
          </div>
          <div className="mt-3 w-full bg-slate-850 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="bg-cyan-500 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" 
              style={{ width: `${metrics.focusScore}%` }}
            ></div>
          </div>
          <p className="mt-2 text-slate-500 text-[10px] uppercase font-mono">Calculated on active software streams</p>
        </div>

        {/* User Interactive States */}
        <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl backdrop-blur-sm flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Active Input Events</span>
            <div className="flex gap-1.5 text-cyan-500">
              <Keyboard className="h-4 w-4" />
              <MousePointer className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-mono text-white font-bold">{metrics.totalKeystrokes.toLocaleString()}</span>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Keys Today</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-mono text-white font-bold">{metrics.totalClicks.toLocaleString()}</span>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Clicks Today</span>
            </div>
          </div>
          <p className="mt-3 text-cyan-500/80 text-[10px] uppercase font-mono">Aggregated hardware telemetry</p>
        </div>

        {/* Network Bandwidth Rate */}
        <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl backdrop-blur-sm flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Network Flow Rate</span>
            <div className="flex gap-1 text-slate-400">
              <ArrowUp className="h-3 w-3 text-rose-400" />
              <ArrowDown className="h-3 w-3 text-emerald-400" />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-white tracking-tight">{(metrics.uploadSpeed + metrics.downloadSpeed).toFixed(1)}</span>
              <span className="text-slate-500 text-xs font-mono uppercase">KBPS COMBINED</span>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono mt-1">
              <span className="text-cyan-400">UP: {metrics.uploadSpeed} KB/s</span>
              <span className="text-slate-550 text-slate-400">DN: {metrics.downloadSpeed} KB/s</span>
            </div>
          </div>
          <p className="mt-3 text-slate-500 text-[10px] uppercase font-mono">0.00% packet loss rate detected</p>
        </div>

        {/* CPU & RAM Utilization Stats */}
        <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl backdrop-blur-sm flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Hardware State</span>
            <Cpu className="h-4 w-4 text-cyan-500" />
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono text-slate-400">CPU LOAD</span>
              <span className="font-mono text-white font-bold">{metrics.cpuLoad}%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono text-slate-400">RAM USAGE</span>
              <span className="font-mono text-white font-bold">{metrics.ramLoad}%</span>
            </div>
          </div>
          <p className="mt-3 text-cyan-500/80 text-[10px] uppercase font-mono">CGroup Sandbox Nodes</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dynamic IO graph timelines */}
        <div className="lg:col-span-8 bg-[#0A0D14] border border-slate-800 p-5 rounded-xl shadow-lg flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-white font-bold text-sm tracking-widest uppercase">Interactive Activity Waves</h3>
              <p className="text-slate-500 text-xs mt-1">Typing speed and aggregate input intervals inside active frames.</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
                <span className="text-slate-400 uppercase">Keystrokes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-pink-500"></span>
                <span className="text-slate-400 uppercase">Mouse Clicks</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorKeys" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.6} />
                <XAxis dataKey="time" stroke="#4b5563" fontSize={10} className="font-mono text-[9px]" />
                <YAxis stroke="#4b5563" fontSize={10} className="font-mono text-[9px]" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0D14', borderColor: 'rgba(6,182,212,0.2)', color: '#fff' }}
                  labelStyle={{ color: 'rgba(6,182,212,1)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="keystrokes" name="Keystrokes" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorKeys)" />
                <Area type="monotone" dataKey="clicks" name="Mouse Clicks" stroke="#ec4899" strokeWidth={1.5} fillOpacity={1} fill="url(#colorClicks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Software Category Distribution */}
        <div className="lg:col-span-4 bg-[#0A0D14] border border-slate-800 p-5 rounded-xl shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="font-display text-white font-bold text-sm tracking-widest uppercase">Software Target Categories</h3>
            <p className="text-slate-500 text-xs mt-1">Application usage share computed over work logging cycles.</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center mt-3">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1f2937" opacity={0.3} />
                  <XAxis type="number" stroke="#4b5563" fontSize={9} className="font-mono text-[9px]" />
                  <YAxis dataKey="name" type="category" stroke="#4b5563" fontSize={9} className="font-mono text-[9px]" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0A0D14', borderColor: 'rgba(6,182,212,0.15)', color: '#fff' }}
                  />
                  <Bar dataKey="value" name="Minutes" radius={[0, 4, 4, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#06b6d4" : "#a855f7"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-500 text-xs font-mono">No active window logs captured yet</div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>TOTAL SESSION RUN:</span>
            <span className="text-cyan-400 font-bold">{metrics.totalActiveTime} MINS</span>
          </div>
        </div>
      </div>

      {/* Cyber timeline log widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0A0D14] border border-slate-800 p-5 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
            <h3 className="font-display text-white font-bold text-sm tracking-widest uppercase">Active Software Timings</h3>
            <span className="text-[10px] font-mono text-cyan-400 py-1 px-2 border border-cyan-500/25 bg-cyan-500/10 rounded uppercase animate-pulse">LIVE RECORD</span>
          </div>
          <div className="divide-y divide-slate-800/60 max-h-64 overflow-y-auto pr-1 space-y-2">
            {activityHistory.slice(0, 5).map((log, index) => (
              <div key={log.id || index} className="pt-2 flex items-center justify-between text-xs font-mono">
                <div className="flex flex-col">
                  <span className="text-cyan-400 font-semibold">{log.appName}</span>
                  <span className="text-slate-500 text-[10px] truncate max-w-xs">{log.windowTitle}</span>
                </div>
                <div className="text-right">
                  <div className="text-slate-300 font-bold">{Math.round(log.duration / 60)}m {log.duration % 60}s</div>
                  <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded text-black font-bold ${
                    log.type === "productive" ? "bg-emerald-400" : log.type === "unproductive" ? "bg-rose-400" : "bg-cyan-400"
                  }`}>
                    {log.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Windows Telemetry daemon details */}
        <div className="bg-[#0A0D14] border border-slate-800 p-5 rounded-xl shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="font-display text-white font-bold text-sm tracking-widest uppercase">IPC Telemetry Core</h3>
            <p className="text-slate-500 text-xs mt-1">Configurations supporting silent executable generation, startup bypass schedules, and telemetry files.</p>
          </div>
          <div className="my-4 space-y-2 font-mono text-[11px] text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-500">DAEMON PATH</span>
              <span className="text-cyan-400 font-medium">C:\ProgramFiles\SOT-Tracker\tracker.exe</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-500">SQLITE STORAGE</span>
              <span className="text-cyan-400 font-medium">%AppData%\Local\SOTTracker\sot_local.db</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-500">REGISTRY AUTOSTART</span>
              <span className="text-cyan-400 font-medium">HKCU\Software\Microsoft\Windows\Run</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">SAMPLE INTERVAL</span>
              <span className="text-pink-400 font-medium">10,000 MS / CONTINUOUS HOOKS</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-slate-500">AUTO-CLEANUP STATUS: SAFETY ENGAGED</span>
            <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/20 py-0.5 px-2 rounded">v4.0.2-Enterprise</span>
          </div>
        </div>
      </div>
    </div>
  );
}
