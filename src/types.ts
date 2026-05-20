export interface ActivityEvent {
  id: string;
  timestamp: string;
  appName: string;
  windowTitle: string;
  duration: number; // in seconds
  type: 'productive' | 'unproductive' | 'neutral';
  category: string;
}

export interface KeyboardMouseMetrics {
  keystrokes: number;
  clicks: number;
  mouseSpeed: number; // cumulative movement units
  typingSpeed: number; // words per min (estimate)
  idleSeconds: number;
}

export interface FileActivity {
  id: string;
  timestamp: string;
  action: 'CREATE' | 'DELETE' | 'MODIFY' | 'RENAME';
  fileName: string;
  filePath: string;
  suspicious: boolean;
  score: number; // hazard score
}

export interface SystemProcess {
  pid: number;
  name: string;
  cpu: number; // percentage
  ram: number; // MB
  status: 'RUNNING' | 'SUSPENDED' | 'KILLED';
  owner: string;
  isNew?: boolean;
}

export interface NetworkConnection {
  id: string;
  proto: 'TCP' | 'UDP';
  localIp: string;
  localPort: number;
  remoteIp: string;
  remotePort: number;
  state: string;
  processName: string;
  sentBytes: number;
  recvBytes: number;
}

export interface SystemAlert {
  id: string;
  timestamp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: 'Process' | 'Network' | 'File' | 'User';
  message: string;
  resolved: boolean;
}

export interface BrowserHistoryItem {
  id: string;
  timestamp: string;
  url: string;
  title: string;
  domain: string;
  duration: number; // seconds
}

export interface SocHistoryLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: string;
  details: string;
}

export interface DashboardMetrics {
  focusScore: number;
  totalActiveTime: number; // minutes
  totalIdleTime: number; // minutes
  productiveTime: number; // minutes
  unproductiveTime: number; // minutes
  totalKeystrokes: number;
  totalClicks: number;
  uploadSpeed: number; // KB/s
  downloadSpeed: number; // KB/s
  cpuLoad: number; // percentage
  ramLoad: number; // percentage
}
