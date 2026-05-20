import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

const DAEMON_URL = "http://127.0.0.1:5005";

async function queryDaemon(endpoint: string, options: any = {}) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 800);
    const response = await fetch(`${DAEMON_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    // Daemon is not running in sandbox node environment, fallback automatically
  }
  return null;
}

// In-memory relational state engine acting as SQLite table store
interface DatabaseSchema {
  system_activity: any[];
  file_integrity: any[];
  mouse_keyboard: any[];
  process_perf: any[];
  connection_network: any[];
  alert_logs: any[];
}

const db: DatabaseSchema = {
  system_activity: [],
  file_integrity: [],
  mouse_keyboard: [],
  process_perf: [],
  connection_network: [],
  alert_logs: [],
};

// Seed historical logs (the past 7 days) to make visualizations rich and complete
function seedDatabase() {
  const now = new Date();
  
  // 1. Mouse and Keyboard speeds (hourly tracking)
  for (let i = 168; i >= 0; i--) {
    const logTime = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = logTime.getHours();
    
    // Low activity at night, peak during typical office hours
    const multiplier = (hour > 8 && hour < 18) ? 1.2 : 0.15;
    const keystrokes = Math.floor((Math.random() * 800 + 150) * multiplier);
    const clicks = Math.floor((Math.random() * 200 + 40) * multiplier);
    const wpm = multiplier > 0.5 ? Math.floor(Math.random() * 25 + 40) : 0;
    
    db.mouse_keyboard.push({
      id: `mk-${168 - i}`,
      timestamp: logTime.toISOString(),
      keystrokes,
      clicks,
      typingSpeed: wpm,
      idleSeconds: hour > 22 || hour < 7 ? 3600 : Math.floor(Math.random() * 1200 + 100),
    });
  }

  // 2. Activity application time shares
  const apps = [
    { name: "code.exe", title: "server.ts - VS Code", cat: "productive", group: "IDE" },
    { name: "chrome.exe", title: "SOT Tracker SOC Console", cat: "productive", group: "Research" },
    { name: "slack.exe", title: "Enterprise Dev Communications", cat: "productive", group: "Chat" },
    { name: "teams.exe", title: "Standup Sync Session", cat: "productive", group: "Chat" },
    { name: "spotify.exe", title: "Deep Focus Ambient Lo-Fi", cat: "unproductive", group: "Music" },
    { name: "discord.exe", title: "Off-topic Watercooler Lounge", cat: "unproductive", group: "Gaming" },
    { name: "cmd.exe", title: "C:\\Windows\\system32\\cmd.exe", cat: "neutral", group: "System Shell" },
  ];

  for (let d = 7; d >= 0; d--) {
    const dayDate = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
    dayDate.setMinutes(0);
    dayDate.setSeconds(0);
    
    apps.forEach((app, idx) => {
      const activeSec = app.cat === "productive" 
        ? Math.floor(Math.random() * 12000 + 4000) 
        : Math.floor(Math.random() * 4000 + 200);
      
      db.system_activity.push({
        id: `sa-${d}-${idx}`,
        timestamp: dayDate.toISOString(),
        appName: app.name,
        windowTitle: app.title,
        duration: activeSec,
        type: app.cat,
        category: app.group,
      });
    });
  }

  // 3. Network connection snapshots
  const remoteIps = ["192.168.1.45", "104.244.42.1", "52.114.158.4", "13.107.4.50", "23.212.180.2", "8.8.8.8"];
  remoteIps.forEach((ip, idx) => {
    db.connection_network.push({
      id: `net-${idx}`,
      proto: idx % 3 === 0 ? "UDP" : "TCP",
      localIp: "192.168.1.102",
      localPort: 51230 + idx,
      remoteIp: ip,
      remotePort: idx % 2 === 0 ? 443 : 80,
      state: idx % 3 === 0 ? "NONE" : "ESTABLISHED",
      processName: apps[idx % apps.length].name,
      sentBytes: Math.floor(Math.random() * 4500000 + 20000),
      recvBytes: Math.floor(Math.random() * 15000000 + 40000),
    });
  });

  // 4. File Integrity Monitors (Previous logs)
  const seedFiles = [
    { action: "CREATE", file: "unauthorized_installer.vbs", path: "C:\\Users\\Admin\\Downloads\\unauthorized_installer.vbs", susp: true, score: 85 },
    { action: "MODIFY", file: "server.ts", path: "/workspace/src/server.ts", susp: false, score: 10 },
    { action: "DELETE", file: "temp_cache.log", path: "C:\\Users\\Admin\\AppData\\Local\\Temp\\temp_cache.log", susp: false, score: 0 },
    { action: "CREATE", file: "payload.bat", path: "C:\\Users\\Admin\\Documents\\payload.bat", susp: true, score: 92 },
    { action: "RENAME", file: "resume_final.pdf", path: "C:\\Users\\Admin\\Desktop\\resume_final.pdf", susp: false, score: 5 },
  ];

  seedFiles.forEach((f, idx) => {
    const fileTime = new Date(now.getTime() - idx * 2 * 60 * 60 * 1000);
    db.file_integrity.push({
      id: `file-${idx}`,
      timestamp: fileTime.toISOString(),
      action: f.action,
      fileName: f.file,
      filePath: f.path,
      suspicious: f.susp,
      score: f.score,
    });

    if (f.susp) {
      db.alert_logs.push({
        id: `alt-${idx}`,
        timestamp: fileTime.toISOString(),
        severity: "HIGH",
        category: "File",
        message: `Suspicious action identified: File ${f.file} exhibits malicious hazard signature. Path: ${f.path}`,
        resolved: false,
      });
    }
  });

  // 5. Initial security process alerts
  db.alert_logs.push({
    id: `alt-proc-init`,
    timestamp: new Date().toISOString(),
    severity: "CRITICAL",
    category: "Process",
    message: "Critical Event: Powershell.exe spawned with hidden bypass arguments in Windows background execution.",
    resolved: false,
  });
}

seedDatabase();

// In-Memory Simulation Loop for Active Real-Time Analytics
let liveUpload = 12.4;
let liveDownload = 245.8;
let keystrokeAcc = 0;
let clickAcc = 0;

setInterval(() => {
  // Drift bandwidth speeds dynamically
  liveUpload = Math.max(1, Math.min(2500, liveUpload + (Math.random() * 80 - 40)));
  liveDownload = Math.max(10, Math.min(12000, liveDownload + (Math.random() * 400 - 200)));
  
  // Register simulated typing activities periodically
  if (Math.random() > 0.3) keystrokeAcc += Math.floor(Math.random() * 6);
  if (Math.random() > 0.6) clickAcc += 1;
}, 1000);

// Watch the Server directory in real-time to generate actual operational file events!
// If any file is edited or created in the workspace, SOT Tracker lists it in the security dashboard.
const projectRoot = path.resolve(".");
try {
  fs.watch(projectRoot, { recursive: true }, (eventType, filename) => {
    if (!filename || filename.includes("node_modules") || filename.includes(".git") || filename.includes("dist")) return;
    
    const nowStr = new Date().toISOString();
    const isSusp = filename.endsWith(".bat") || filename.endsWith(".sh") || filename.endsWith(".vbs");
    const score = isSusp ? 88 : 10;
    
    // Avoid double logging within very short limits
    const duplicate = db.file_integrity.find(
      (f) => f.fileName === filename && (new Date(f.timestamp).getTime() - new Date(nowStr).getTime() < 3000)
    );
    if (duplicate) return;

    const action = eventType === "change" ? "MODIFY" : "CREATE";
    const newEvent = {
      id: `fim-real-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: nowStr,
      action,
      fileName: path.basename(filename),
      filePath: path.join(projectRoot, filename),
      suspicious: isSusp,
      score,
    };
    
    db.file_integrity.unshift(newEvent);

    // Limit to largest log size
    if (db.file_integrity.length > 200) db.file_integrity.pop();

    if (isSusp) {
      db.alert_logs.unshift({
        id: `alt-real-${Date.now()}`,
        timestamp: nowStr,
        severity: "CRITICAL",
        category: "File",
        message: `Alert: Real-time FIM triggered! Suspicious file creation in project workspace: ${filename}`,
        resolved: false,
      });
    }
  });
  console.log(`[SOT-Tracker] Server-Side File Integrity Monitor (FIM) active on ${projectRoot}`);
} catch (err) {
  console.warn("FIM filesystem watcher not supported in this container environment, falling back.");
}

// REST ENDPOINTS

// 1. Live system statistics
app.get("/api/metrics", async (req, res) => {
  const daemonData = await queryDaemon("/api/metrics");
  if (daemonData) {
    return res.json(daemonData);
  }

  // Dynamically calculate focus metrics from seeded data
  const proSum = db.system_activity.filter((e) => e.type === "productive").reduce((acc, curr) => acc + curr.duration, 0);
  const unproSum = db.system_activity.filter((e) => e.type === "unproductive").reduce((acc, curr) => acc + curr.duration, 0);
  const total = proSum + unproSum || 1;
  const focusScore = Math.round((proSum / total) * 100);

  // Return standard container stats and active simulated keystrokes
  res.json({
    focusScore,
    totalActiveTime: Math.round(total / 60),
    totalIdleTime: Math.floor(Math.random() * 45 + 15),
    productiveTime: Math.round(proSum / 60),
    unproductiveTime: Math.round(unproSum / 60),
    totalKeystrokes: db.mouse_keyboard.reduce((acc, curr) => acc + curr.keystrokes, 0) + keystrokeAcc,
    totalClicks: db.mouse_keyboard.reduce((acc, curr) => acc + curr.clicks, 0) + clickAcc,
    uploadSpeed: Math.round(liveUpload * 10) / 10,
    downloadSpeed: Math.round(liveDownload * 10) / 10,
    cpuLoad: Math.round(Math.random() * 20 + 8),
    ramLoad: Math.round(Math.random() * 15 + 45),
  });
});

// 2. Running system processes list (with simulated state control)
let simulatedProcesses = [
  { pid: 1400, name: "System Idle Process", cpu: 75, ram: 4, status: "RUNNING", owner: "SYSTEM" },
  { pid: 4, name: "System Kernel", cpu: 1.4, ram: 145, status: "RUNNING", owner: "SYSTEM" },
  { pid: 2101, name: "sot_tracker_agent.exe", cpu: 0.2, ram: 48, status: "RUNNING", owner: "Admin" },
  { pid: 4852, name: "chrome.exe", cpu: 4.8, ram: 340, status: "RUNNING", owner: "Admin" },
  { pid: 8840, name: "code.exe", cpu: 12.1, ram: 512, status: "RUNNING", owner: "Admin" },
  { pid: 10452, name: "spotify.exe", cpu: 0.8, ram: 110, status: "RUNNING", owner: "Admin" },
  { pid: 3340, name: "discord.exe", cpu: 1.5, ram: 165, status: "RUNNING", owner: "Admin" },
  { pid: 12404, name: "powershell.exe", cpu: 0.0, ram: 32, status: "RUNNING", owner: "SYSTEM" },
  { pid: 5542, name: "watchdog_host.exe", cpu: 0.5, ram: 18, status: "RUNNING", owner: "SYSTEM" },
  { pid: 15410, name: "unauthorized_installer.vbs", cpu: 8.4, ram: 22, status: "RUNNING", owner: "Admin", isNew: true },
];

app.get("/api/processes", async (req, res) => {
  const daemonData = await queryDaemon("/api/processes");
  if (daemonData) {
    return res.json(daemonData);
  }

  // Slightly randomize CPU values of active processes to make lists look highly reactive
  const items = simulatedProcesses.map((p) => {
    if (p.status === "RUNNING") {
      const cpuDelta = (Math.random() * 2 - 1);
      return { ...p, cpu: Math.max(0, Math.round((p.cpu + cpuDelta) * 10) / 10) };
    }
    return p;
  });
  res.json(items);
});

// Kill process API
app.post("/api/processes/kill", async (req, res) => {
  const { pid } = req.body;
  const daemonData = await queryDaemon("/api/processes/kill", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pid })
  });
  if (daemonData) {
    return res.json(daemonData);
  }

  const target = simulatedProcesses.find((p) => p.pid === Number(pid));
  if (target) {
    target.status = "KILLED";
    target.cpu = 0;
    target.ram = 0;
    
    // Add security audit trail event
    db.alert_logs.unshift({
      id: `alt-kill-${Date.now()}`,
      timestamp: new Date().toISOString(),
      severity: "LOW",
      category: "Process",
      message: `Administrator termination command executed successfully on PID ${pid} (${target.name}).`,
      resolved: true,
    });

    return res.json({ success: true, message: `Terminated process PID ${pid} (${target.name})` });
  }
  res.status(404).json({ success: false, message: "Target PID not identified." });
});

// Suspend process API
app.post("/api/processes/suspend", async (req, res) => {
  const { pid } = req.body;
  const daemonData = await queryDaemon("/api/processes/suspend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pid })
  });
  if (daemonData) {
    return res.json(daemonData);
  }

  const target = simulatedProcesses.find((p) => p.pid === Number(pid));
  if (target) {
    target.status = target.status === "SUSPENDED" ? "RUNNING" : "SUSPENDED";
    if (target.status === "SUSPENDED") target.cpu = 0;
    return res.json({ success: true, message: `Suspended process PID ${pid} (${target.name})` });
  }
  res.status(404).json({ success: false, message: "Process PID not identified." });
});

// 3. Activity timelines, file events, connections, and mouse keystroke aggregates
app.get("/api/log-history", async (req, res) => {
  const { category } = req.query;
  const daemonData = await queryDaemon(`/api/log-history?category=${category}`);
  if (daemonData) {
    return res.json(daemonData);
  }
  
  if (category === "activity") {
    return res.json(db.system_activity);
  } else if (category === "file") {
    return res.json(db.file_integrity);
  } else if (category === "connections") {
    return res.json(db.connection_network);
  } else if (category === "io_analytics") {
    return res.json(db.mouse_keyboard);
  }
  
  res.json({ error: "Context not found." });
});

// Add dynamic user simulation alerts or external telemetry
app.post("/api/add-event", (req, res) => {
  const { table, data } = req.body;
  const targetTable = db[table as keyof DatabaseSchema];
  if (targetTable) {
    const newItem = { id: `${table}-${Date.now()}`, timestamp: new Date().toISOString(), ...data };
    targetTable.unshift(newItem);
    if (targetTable.length > 500) targetTable.pop();
    return res.json({ success: true, item: newItem });
  }
  res.status(404).json({ error: "Invalid SQLite catalog category." });
});

// Clear/Flush SQLite log tables API
app.post("/api/clear-logs", async (req, res) => {
  const { category } = req.body;
  const daemonData = await queryDaemon("/api/clear-logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category })
  });
  if (daemonData) {
    return res.json(daemonData);
  }

  if (!category || category === "all") {
    db.system_activity = [];
    db.file_integrity = [];
    db.alert_logs = [];
    return res.json({ success: true, message: "All SQLite tables flushed successfully." });
  }
  const targetTable = db[category as keyof DatabaseSchema];
  if (targetTable) {
    db[category as keyof DatabaseSchema] = [];
    return res.json({ success: true, message: `Cleared table matching category: ${category}` });
  }
  res.status(400).json({ error: "Unknown table namespace." });
});

// 4. Alerts
app.get("/api/alerts", async (req, res) => {
  const daemonData = await queryDaemon("/api/alerts");
  if (daemonData) {
    return res.json(daemonData);
  }
  res.json(db.alert_logs);
});

app.post("/api/alerts/resolve", async (req, res) => {
  const { id } = req.body;
  const daemonData = await queryDaemon("/api/alerts/resolve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  if (daemonData) {
    return res.json(daemonData);
  }

  const alert = db.alert_logs.find((a) => a.id === id);
  if (alert) {
    alert.resolved = true;
    return res.json({ success: true, alert });
  }
  res.status(404).json({ error: "Alert not found." });
});

// 5. Server-side AI Threat Analysis using Google Gemini
app.post("/api/ai-analysis", async (req, res) => {
  const { alertMessage } = req.body;
  if (!alertMessage) {
    return res.status(400).json({ error: "Please provide an alert or logging dataset to analyze." });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey || geminiApiKey === "MY_GEMINI_API_KEY") {
    return res.json({
      summary: "AI Threat Analyst is currently in offline evaluation mode. To activate live analysis, attach a real Gemini API Key in the Settings panel of Google AI Studio.",
      threatLevel: "EVALUATION_MODE",
      recommendations: ["Assign process priorities immediately", "Identify directory permissions", "Verify network ports"]
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `You are an expert Cybersecurity Incident Responder and SOC Threat Analyst.
Analyze the following endpoint alert message reported by the workspace security engine:
"${alertMessage}"

Provide your feedback in a structured JSON schema form:
{
  "summary": "Deep forensic summary of the alert",
  "threatLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "recommendations": ["Direct actions the team or administrator must perform to mitigate this threat"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text.trim());
    return res.json(data);

  } catch (error: any) {
    console.error("Gemini API call failed:", error);
    return res.json({
      summary: `Failed to complete real-time forensic assessment: ${error.message || error}`,
      threatLevel: "UNKNOWN",
      recommendations: ["Review localized SOC alerts console", "Isolate suspicious assets manually"]
    });
  }
});


// FRONTEND EMBEDDING (VITE MIDDLEWARE WITH PRODUCTION FALLBACK)

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: any, res: any) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SOT-Tracker Server] Operating on http://localhost:${PORT}`);
  });
}

startServer();
