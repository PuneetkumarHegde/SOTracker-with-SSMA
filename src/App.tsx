import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Cpu, 
  History, 
  ShieldAlert, 
  Terminal, 
  Settings, 
  LogOut, 
  Fingerprint, 
  Clock, 
  RotateCcw,
  Timer,
  Play,
  Pause,
  AlertTriangle,
  User,
  Sliders,
  Sparkles
} from "lucide-react";
import DashboardView from "./components/DashboardView";
import ProcessMonitorView from "./components/ProcessMonitorView";
import FileIntegrityView from "./components/FileIntegrityView";
import SecurityAlertView from "./components/SecurityAlertView";
import ManualInstaller from "./components/ManualInstaller";
import { 
  DashboardMetrics, 
  ActivityEvent, 
  FileActivity, 
  SystemProcess, 
  NetworkConnection, 
  SystemAlert,
  SocHistoryLog
} from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "processes" | "fim" | "soc" | "installer">("dashboard");
  
  // Real-time server states
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    focusScore: 84,
    totalActiveTime: 360,
    totalIdleTime: 42,
    productiveTime: 298,
    unproductiveTime: 62,
    totalKeystrokes: 1424,
    totalClicks: 424,
    uploadSpeed: 10.5,
    downloadSpeed: 124.5,
    cpuLoad: 12,
    ramLoad: 52
  });

  const [processes, setProcesses] = useState<SystemProcess[]>([]);
  const [activityHistory, setActivityHistory] = useState<ActivityEvent[]>([]);
  const [filesHistory, setFilesHistory] = useState<FileActivity[]>([]);
  const [connections, setConnections] = useState<NetworkConnection[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [ioHistory, setIoHistory] = useState<any[]>([]);

  // Simulation Controls & Sound Aligner (Visual Cue)
  const [simActive, setSimActive] = useState(true);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [utcTime, setUtcTime] = useState("2026-05-20 14:52:00 UTC");

  // Load and refresh core telemetry data from Express full-stack API
  const fetchTelemetry = async () => {
    try {
      const [resMetrics, resProc, resAct, resFiles, resConn, resAlerts, resIo] = await Promise.all([
        fetch("/api/metrics").then(r => r.json()),
        fetch("/api/processes").then(r => r.json()),
        fetch("/api/log-history?category=activity").then(r => r.json()),
        fetch("/api/log-history?category=file").then(r => r.json()),
        fetch("/api/log-history?category=connections").then(r => r.json()),
        fetch("/api/alerts").then(r => r.json()),
        fetch("/api/log-history?category=io_analytics").then(r => r.json())
      ]);

      setMetrics(resMetrics);
      setProcesses(resProc);
      setActivityHistory(resAct);
      setFilesHistory(resFiles);
      setConnections(resConn);
      setAlerts(resAlerts);
      setIoHistory(resIo);
    } catch (err) {
      console.warn("Express API routes initializing or offline, keeping fallback simulations.");
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(() => {
      if (simActive) {
        fetchTelemetry();
      }
    }, 2800);
    return () => clearInterval(interval);
  }, [simActive]);

  // Clock Update loop
  useEffect(() => {
    const clockInterval = setInterval(() => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace("GMT", "UTC"));
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Pomodoro timer hook
  useEffect(() => {
    if (pomodoroRunning && pomodoroTime > 0) {
      const timer = setTimeout(() => {
        setPomodoroTime(pomodoroTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (pomodoroTime === 0) {
      setPomodoroRunning(false);
    }
  }, [pomodoroTime, pomodoroRunning]);

  const handleTogglePomodoro = () => {
    setPomodoroRunning(!pomodoroRunning);
  };

  const handleResetPomodoro = () => {
    setPomodoroRunning(false);
    setPomodoroTime(25 * 60);
  };

  // API Call to terminate Windows/Linux Thread process
  const handleKillProcess = async (pid: number) => {
    try {
      const response = await fetch("/api/processes/kill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pid })
      });
      const data = await response.json();
      if (data.success) {
        fetchTelemetry(); // Instant refresh
      }
    } catch (err) {
      console.error("Failed to terminate target process:", err);
    }
  };

  // API Call to Suspend process ID
  const handleSuspendProcess = async (pid: number) => {
    try {
      const response = await fetch("/api/processes/suspend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pid })
      });
      const data = await response.json();
      if (data.success) {
        fetchTelemetry();
      }
    } catch (err) {
       console.error("Failed to suspend target process:", err);
    }
  };

  // Resolve threat alert API callback
  const handleResolveAlert = async (id: string) => {
    try {
      const response = await fetch("/api/alerts/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await response.json();
      if (data.success) {
        fetchTelemetry();
      }
    } catch (err) {
      console.error("Failed to resolve alert:", err);
    }
  };

  // Flush all audit history logs
  const handleClearFimLogs = async () => {
    try {
      await fetch("/api/clear-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: "file" })
      });
      fetchTelemetry();
    } catch (err) {
      console.error("Failed to reset SQLite logs:", err);
    }
  };

  const unreadCriticalAlerts = alerts.filter(a => !a.resolved && a.severity === "CRITICAL").length;

  return (
    <div className="min-h-screen bg-[#05070A] flex flex-col antialiased text-slate-300">
      {/* Top Navigation Frame */}
      <header className="border-b border-slate-800 bg-[#0A0D14]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo Name block */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 rounded-lg bg-cyan-500/30 blur-sm animate-pulse"></div>
              <div className="relative p-2 rounded-lg bg-[#0A0D14] border border-cyan-500/40">
                <Fingerprint className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-cyan-500 uppercase tracking-widest">
                  SOT Tracker
                </span>
                <span className="text-[9px] px-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded font-mono font-bold animate-pulse">
                  DAEMON LIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono tracking-wider">SECURE SYSTEM MONITORING AGENT v2.5.0</p>
            </div>
          </div>

          {/* SOT System Timers & Dials */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-mono">
            {/* Live Clock HUD */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 py-1.5 px-3 rounded-lg text-slate-400">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-slate-300 whitespace-nowrap">{utcTime}</span>
            </div>

            {/* Pomodoro Focus HUD widget */}
            <div className="flex items-center gap-3 bg-cyan-500/10 py-1.5 px-3 rounded-lg border border-cyan-500/20 text-slate-300">
              <Timer className="h-3.5 w-3.5 text-cyan-400" />
              <span>
                {Math.floor(pomodoroTime / 60)}:{(pomodoroTime % 60).toString().padStart(2, "0")}
              </span>
              <button 
                onClick={handleTogglePomodoro}
                className="hover:text-cyan-300 cursor-pointer text-slate-300"
                title={pomodoroRunning ? "Pause work session" : "Start work session"}
              >
                {pomodoroRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              </button>
              <button 
                onClick={handleResetPomodoro}
                className="hover:text-cyan-300 cursor-pointer text-slate-400"
                title="Reset work session"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            </div>

            {/* Threat indicator HUD */}
            <div className={`flex items-center gap-2 py-1.5 px-3 rounded-lg border uppercase tracking-wider text-[10px] ${
              unreadCriticalAlerts > 0 
                ? "bg-rose-950/20 border-rose-500/30 text-rose-400 animate-pulse-cyan" 
                : "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
            }`}>
              <div className={`h-1.5 w-1.5 rounded-full ${unreadCriticalAlerts > 0 ? "bg-rose-400 animate-ping" : "bg-emerald-400"}`}></div>
              <span>{unreadCriticalAlerts > 0 ? `ALERT: ${unreadCriticalAlerts} CRITICALS` : "SIEM NORMAL"}</span>
            </div>
          </div>

          {/* User profiles */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block font-mono text-[10px]">
              <div className="font-bold text-slate-350 uppercase text-slate-200">punet.hegde@enterprise</div>
              <span className="text-slate-500">Node: Sandbox CGroup</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 font-mono text-sm font-bold">
              PH
            </div>
          </div>

        </div>
      </header>

      {/* Main Grid Frame */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Navigation Rails Panel */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="glass-cyber-panel p-4 rounded-xl space-y-3">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1">
              Command Modules
            </div>
            <nav className="space-y-1">
              {/* Dashboard Tab */}
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-medium uppercase tracking-wider transition duration-150 cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold"
                    : "border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>SOC Dashboard</span>
              </button>

              {/* Processes Tab */}
              <button
                onClick={() => setActiveTab("processes")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-medium uppercase tracking-wider transition duration-150 cursor-pointer ${
                  activeTab === "processes"
                    ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold"
                    : "border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                }`}
              >
                <Cpu className="h-4 w-4" />
                <span>Process Monitor</span>
              </button>

              {/* FIM Tab */}
              <button
                onClick={() => setActiveTab("fim")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-medium uppercase tracking-wider transition duration-150 cursor-pointer ${
                  activeTab === "fim"
                    ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold"
                    : "border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                }`}
              >
                <History className="h-4 w-4" />
                <span>File Integrity</span>
              </button>

              {/* SOC Alerts and Networks Tab */}
              <button
                onClick={() => setActiveTab("soc")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-mono font-medium uppercase tracking-wider transition duration-150 cursor-pointer ${
                  activeTab === "soc"
                    ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold"
                    : "border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Threats & Alerts</span>
                </div>
                {unreadCriticalAlerts > 0 && (
                  <span className="h-4 w-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                    {unreadCriticalAlerts}
                  </span>
                )}
              </button>

              {/* Packaging Setup */}
              <button
                onClick={() => setActiveTab("installer")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-medium uppercase tracking-wider transition duration-150 cursor-pointer ${
                  activeTab === "installer"
                    ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold"
                    : "border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                }`}
              >
                <Terminal className="h-4 w-4" />
                <span>Endpoint Install</span>
              </button>
            </nav>
          </div>

          {/* Polling controller */}
          <div className="glass-cyber-panel p-5 rounded-xl space-y-4 font-mono text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase">Live polling feeds</span>
              <span className={`h-2 w-2 rounded-full ${simActive ? "bg-cyan-400 animate-ping" : "bg-slate-600"}`}></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Continuous Sync</span>
              <button
                onClick={() => setSimActive(!simActive)}
                className={`text-[10px] font-bold py-1 px-3.5 rounded-md cursor-pointer transition ${
                  simActive ? "bg-cyan-500/10 border border-cyan-400/40 text-cyan-400" : "bg-slate-800 border border-slate-700 text-slate-400"
                }`}
              >
                {simActive ? "ACTIVE" : "PAUSED"}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              When Continuous Sync is active, SOT Tracker dynamically contacts the server endpoint daemon to reload hardware allocations, active windows, and threat audit trails.
            </p>
          </div>
        </aside>

        {/* Right Details Panel Layout */}
        <main className="lg:col-span-9">
          {activeTab === "dashboard" && (
            <DashboardView 
              metrics={metrics} 
              activityHistory={activityHistory} 
              ioHistory={ioHistory}
            />
          )}

          {activeTab === "processes" && (
            <ProcessMonitorView 
              processes={processes} 
              onKill={handleKillProcess} 
              onSuspend={handleSuspendProcess}
              onRefresh={fetchTelemetry}
            />
          )}

          {activeTab === "fim" && (
            <FileIntegrityView 
              filesHistory={filesHistory} 
              onClear={handleClearFimLogs}
            />
          )}

          {activeTab === "soc" && (
            <SecurityAlertView 
              alerts={alerts} 
              connections={connections} 
              onResolve={handleResolveAlert}
            />
          )}

          {activeTab === "installer" && (
            <ManualInstaller />
          )}
        </main>

      </div>

      {/* Cyber SOC footer */}
      <footer className="border-t border-slate-800 bg-[#0A0D14] py-4 font-mono text-[10px] mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-slate-500 gap-2">
          <span>SOT Tracker - Corporate Employee Security & Activity Telemetry Engine</span>
          <span>ST-SANDBOX // SECURE DEPLOYMENT ENGINE INTEGRITY HOOK</span>
        </div>
      </footer>
    </div>
  );
}
