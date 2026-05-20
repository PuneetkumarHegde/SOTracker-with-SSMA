import React from "react";
import { 
  FileCode, 
  Terminal, 
  Settings, 
  CheckCircle, 
  Cpu, 
  Info, 
  ArrowRight,
  Monitor,
  Share2
} from "lucide-react";

export default function ManualInstaller() {
  return (
    <div className="space-y-6 text-slate-300 animate-fade-in">
      {/* Overview Block */}
      <div className="bg-[#0A0D14] border border-slate-800 p-6 rounded-xl space-y-3 shadow-lg">
        <h3 className="font-display text-white text-lg font-bold uppercase tracking-wider text-cyan-400">
          SOT Tracker Endpoint Deployment Console
        </h3>
        <p className="text-slate-400 text-xs leading-relaxed max-w-4xl">
          SOT Tracker functions through a zero-latency loopback architecture. The frontend dashboard displays real-time telemetry, while a background Python tracking daemon monitors keyboard sessions, processes, file integrity tables, and Windows events. Review the following guide to package and run this application locally on your laptop.
        </p>
      </div>

      {/* 🚀 New 1-Click Laptop Executable Section */}
      <div className="bg-gradient-to-br from-cyan-950/20 to-purple-950/20 border border-cyan-500/30 p-6 rounded-xl space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute right-4 top-4 max-md:hidden opacity-10">
          <Share2 className="h-28 w-28 text-cyan-400" />
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-950 text-cyan-400 rounded-lg border border-cyan-500/25">
            <Cpu className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-md font-mono font-bold text-white uppercase tracking-wider text-cyan-400">
              One-Click Standalone Windows Executable (`.exe`) Package
            </h4>
            <p className="text-[11px] text-slate-500 font-mono tracking-wider font-bold">
              COMPILER ARCHITECTURE READY • BACKEND + FRONTEND + DAEMON WRAPPED TOGETHER
            </p>
          </div>
        </div>
        
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          I have fully configured and pre-packaged an automated, single-click compiler script called <code className="bg-slate-900 px-1.5 py-0.5 rounded text-pink-400 font-mono text-[10.5px]">build-windows-app.bat</code> at the root of the source project folder. This wraps both the Node.js Express server GUI and the Python local tracker hooks inside a single, zero-installation, portable desktop executable (<strong className="text-cyan-350 font-bold text-cyan-400">SOTTracker.exe</strong>) for your laptop.
        </p>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
          <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            ⚡ Quick Setup Guide:
          </h5>
          <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 font-mono">
            <li>
              Click on the top-right <strong className="text-slate-100">Settings Gear icon</strong> in Google AI Studio, select <strong className="text-cyan-400">Export to ZIP</strong>, and extract the folder to your laptop.
            </li>
            <li>
              Ensure <strong className="text-slate-100">Node.js</strong> is installed on your laptop (free download from <a href="https://nodejs.org" target="_blank" rel="noreferrer" className="text-cyan-400 underline hover:text-cyan-300">nodejs.org</a>).
            </li>
            <li>
              Double-click <strong className="text-pink-400">build-windows-app.bat</strong> inside the folder.
            </li>
            <li>
              The script handles all package installations, compiles code arrays, bundles the Python tracking engine, and writes <strong className="text-emerald-400">dist\SOTTracker.exe</strong>.
            </li>
          </ol>
          <div className="pt-2 text-[10.5px] text-slate-400 font-mono">
            💡 <strong className="text-cyan-400">Pro-Tip:</strong> Double-clicking the resulting <code className="bg-slate-900 border border-slate-800 px-1 py-0.5 text-emerald-400 text-[10px]">SOTTracker.exe</code> triggers the background telemetry tracking processes, starts the database logs on your laptop, and boots up your interactive console instantly!
          </div>
        </div>
      </div>

      {/* Local execution guide */}
      <div className="bg-[#0A0D14] border border-slate-800 p-6 rounded-xl space-y-4 shadow-lg">
        <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider text-cyan-400 border-b border-slate-850 pb-2">
          How to Run This App Directly on Your Laptop
        </h4>
        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          <div>
            <span className="font-bold text-white">Step 1: Download & Extract Project Files</span>
            <p className="text-slate-400 mt-1">
              Click on the top-right Settings menu (Gear icon) in Google AI Studio, select <b>Export to ZIP</b>, and extract the folder to your laptop (e.g., to your Desktop or Documents).
            </p>
          </div>

          <div>
            <span className="font-bold text-white">Step 2: Install Node.js & Start Frontend Server</span>
            <p className="text-slate-400 mt-1">
              Make sure you have Node.js installed. Open a terminal or Command Prompt in the extracted folder and run:
            </p>
            <div className="bg-slate-950 border border-slate-800 rounded p-3 font-mono text-[11px] text-cyan-300 mt-2 space-y-1">
              <div>npm install</div>
              <div>npm run dev</div>
            </div>
            <p className="text-slate-400 mt-1.5">
              This boots the full-stack server on <b>http://localhost:3000</b>. Open this address in your web browser.
            </p>
          </div>

          <div>
            <span className="font-bold text-white">Step 3: Setup & Start Python background daemon</span>
            <p className="text-slate-400 mt-1">
              Open a second Command Prompt or PowerShell window in the same directory, then run the background monitoring listener daemon:
            </p>
            <div className="bg-slate-950 border border-slate-800 rounded p-3 font-mono text-[11px] text-cyan-300 mt-2 space-y-2">
              <div>
                <span className="text-slate-500"># Install the local tracking dependencies</span>
                <div>pip install psutil pynput watchdog pywin32 pygetwindow wmi</div>
              </div>
              <div>
                <span className="text-slate-500"># Launch the background telemetry loop daemon script</span>
                <div>python desktop-agent/tracker.py</div>
              </div>
            </div>
            <p className="text-slate-400 mt-1.5">
              The Python daemon connects to local tracking hooks and boots secure SQLite logs. The Node.js Express server automatically detects it and streams hardware metrics straight into your web browser dashboard in perfect sync!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Python Daemon packaging commands */}
        <div className="bg-[#0A0D14] border border-slate-800 p-5 rounded-xl space-y-4 shadow-md">
          <div className="flex items-center gap-2 text-cyan-400 font-display font-medium text-sm tracking-wide uppercase">
            <Terminal className="h-5 w-5" />
            <span>1. Package Python Daemon Telemetry</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Configure, sandbox, and package the background python script into a standalone windows executable using PyInstaller.
          </p>

          <div className="bg-slate-950 border border-slate-800 rounded p-4 font-mono text-[10.5px] text-cyan-300 leading-relaxed space-y-3">
            <div>
              <span className="text-slate-500"># Direct setup inside Windows cmd / powershell</span>
              <div>pip install psutil pynput watchdog pywin32 pygetwindow wmi</div>
            </div>
            <div>
              <span className="text-slate-500"># Build as a silent background exe (No console)</span>
              <div>pyinstaller --noconsole --onefile --name=SOTTrackerDaemon tracker.py</div>
            </div>
            <div>
              <span className="text-slate-500"># Resulting exe is stored at:</span>
              <div className="text-pink-400">dist\SOTTrackerDaemon.exe</div>
            </div>
          </div>
        </div>

        {/* Electron + React bundle instructions */}
        <div className="bg-[#0A0D14] border border-slate-800 p-5 rounded-xl space-y-4 shadow-md">
          <div className="flex items-center gap-2 text-purple-400 font-display font-medium text-sm tracking-wide uppercase">
            <Monitor className="h-5 w-5" />
            <span>2. Electron Wrapper Main IPC setup</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Configure the Electron main process (<code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300 font-mono text-[9.5px]">main.js</code>) to initiate loopback IPC and read local SQLite registers.
          </p>

          <div className="bg-slate-950 border border-slate-805 border-slate-800 rounded p-4 font-mono text-[10px] text-slate-300 leading-relaxed max-h-52 overflow-y-auto">
            <pre>{`const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let daemonProcess;

function startupDaemon() {
  const daemonPath = path.join(process.resourcesPath, 'SOTTrackerDaemon.exe');
  daemonProcess = spawn(daemonPath);
  
  daemonProcess.stdout.on('data', (data) => {
    console.log('[Daemon Log]:', data.toString());
  });
}

app.whenReady().then(() => {
  createWindow();
  startupDaemon(); // Start tracker safely
});

app.on('will-quit', () => {
  if (daemonProcess) daemonProcess.kill();
});`}</pre>
          </div>
        </div>
      </div>

      {/* Windows Registry start instructions */}
      <div className="bg-[#0A0D14] border border-slate-800 p-5 rounded-xl space-y-4 shadow-md">
        <div className="flex items-center gap-2 text-cyan-400 font-display font-medium text-sm tracking-wider uppercase">
          <Settings className="h-5 w-5" />
          <span>3. Configure Automatic Startup Registry Keys</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          To log laptop sessions immediately upon user logon, SOT Tracker configures a startup hook in the Windows registry index.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded p-4 space-y-2">
            <h4 className="text-xs font-mono font-bold text-white">Automatic Registry Key Creation:</h4>
            <div className="bg-slate-950 p-2 border border-slate-800 font-mono text-[10px] text-cyan-400 break-all">
              REG ADD "HKCU\Software\Microsoft\Windows\Run" /V "SOTTrackerAgent" /T REG_SZ /D "C:\Program Files\SOT-Tracker\tracker.exe" /F
            </div>
            <p className="text-[10px] text-slate-500 font-mono pt-1">
              Provides silent start on boots without triggering system UAC prompts.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded p-4 space-y-2">
            <h4 className="text-xs font-mono font-bold text-white">Silent Windows Service Option:</h4>
            <div className="bg-slate-950 p-2 border border-slate-800 font-mono text-[10px] text-pink-400 break-all">
              sc.exe create "SOTTrackerTelemetry" binPath= "C:\Program Files\SOT-Tracker\tracker.exe" start= auto
            </div>
            <p className="text-[10px] text-slate-500 font-mono pt-1">
              Supports server-wide audits by running under high authority System privileges.
            </p>
          </div>
        </div>
      </div>

      {/* Safety notices */}
      <div className="p-4 rounded-lg bg-cyan-950/10 border border-cyan-800/20 flex items-start gap-3 shadow-md">
        <Info className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-mono font-bold text-cyan-300">ADMINISTRATIVE AUDITING COMPLIANCE WARNING</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Ensure proper corporate authorization keys and compliance alerts are posted before installing this daemon client monitoring agent onto remote employee hardware assets. Local data caches remain private inside individual AppData registry branches.
          </p>
        </div>
      </div>
    </div>
  );
}
