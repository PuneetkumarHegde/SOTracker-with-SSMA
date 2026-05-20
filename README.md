````markdown
# SOTracker-with-SSMA

# Secure System Monitoring Agent

SOTracker-with-SSMA is a real-time Windows system monitoring and activity analytics platform built using React, Electron, Python, Node.js, and SQLite.

The project is designed for:
- System activity monitoring
- Endpoint observation
- Productivity analytics
- Real-time process tracking
- Cybersecurity-oriented dashboard visualization

---

# Features

## Real-Time System Monitoring
- CPU usage monitoring
- RAM usage monitoring
- Disk usage analytics
- Active process tracking
- Running application detection
- System uptime tracking

---

## User Activity Tracking
- Keyboard activity analytics
- Mouse activity monitoring
- Active window title tracking
- Application usage tracking
- Idle time detection
- Session duration tracking

---

## File System Monitoring
- Downloads folder observation
- Desktop monitoring
- Documents folder monitoring
- File create/delete/rename detection
- File activity logging

---

## Productivity Analytics
- Productivity scoring
- Focus analytics
- Daily usage statistics
- Time usage visualization
- Work session tracking

---

## Dashboard Features
- Real-time charts
- Live monitoring widgets
- Cybersecurity-style UI
- Glassmorphism dashboard
- Dark futuristic design
- Interactive analytics panels

---

# Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- Electron
- Recharts

---

## Backend
- Node.js
- Express.js

---

## Monitoring Engine
- Python

---

## Database
- SQLite

---

# Project Architecture

```txt
Electron Desktop App
        ↓
React Dashboard UI
        ↓
Node.js / Express API
        ↓
Python Monitoring Engine
        ↓
SQLite Database
````

---

# Folder Structure

```txt
SOTracker-with-SSMA/
│
├── src/
├── public/
├── desktop-agent/
│   └── tracker.py
│
├── dist/
├── build/
├── main.cjs
├── server.ts
├── vite.config.ts
├── package.json
└── README.md
```

---

# Required Installations

# 1. Install Node.js

Download and install:

* Node.js v18 or higher

Verify installation:

```bash
node -v
npm -v
```

---

# 2. Install Python

Install:

* Python 3.10 or higher

Verify installation:

```bash
python --version
```

---

# 3. Install Git

Download and install Git.

Verify:

```bash
git --version
```

---

# Recommended Tools

* VS Code
* Windows 10 / Windows 11

---

# Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/SOTracker-with-SSMA.git
cd SOTracker-with-SSMA
```

---

# Install Node Dependencies

Run:

```bash
npm install
```

---

# Main Node.js Dependencies

```txt
react
react-dom
vite
electron
electron-builder
express
dotenv
lucide-react
motion
recharts
```

---

# Development Dependencies

```txt
typescript
tsx
esbuild
tailwindcss
postcss
autoprefixer
@vitejs/plugin-react
@types/node
@types/express
@types/recharts
```

---

# Install Python Dependencies

Run:

```bash
pip install psutil pynput watchdog pywin32 pygetwindow wmi pyinstaller
```

---

# Python Modules Used

```txt
psutil
pynput
watchdog
pywin32
pygetwindow
wmi
pyinstaller
sqlite3
threading
json
time
os
datetime
http.server
```

---

# Run Development Server

Start frontend/backend:

```bash
npm run dev
```

Open browser:

```txt
http://localhost:3000
```

---

# Run Monitoring Backend

Start Python monitoring engine:

```bash
python desktop-agent/tracker.py
```

This enables:

* Live system monitoring
* Activity tracking
* Process observation
* Keyboard analytics
* Real-time monitoring data

---

# Build Monitoring Engine Executable

Convert tracker into standalone executable:

```bash
python -m PyInstaller --onefile desktop-agent/tracker.py
```

Generated file:

```txt
dist/tracker.exe
```

---

# Package Electron Application

Build desktop application:

```bash
npm run app:package
```

Generated application:

```txt
dist/win-unpacked/SOTTracker.exe
```

---

# Security Features

* Local monitoring architecture
* Offline analytics
* Activity logging
* Endpoint observation
* Real-time tracking
* Local database storage

---

# Future Enhancements

* AI-based anomaly detection
* Network packet monitoring
* Threat intelligence integration
* USB device monitoring
* Screenshot capture
* Background Windows service
* Auto-start monitoring
* Cloud synchronization
* Multi-user support

---

# System Requirements

```txt
Windows 10 / Windows 11
Node.js v18+
Python 3.10+
Git
VS Code (recommended)
```

---

# Developer

## Puneetkumar Ganapati Hegde

Cybersecurity Engineering Student

Focused on:

* Endpoint monitoring
* Threat analysis
* Security analytics
* System observation
* Real-time monitoring systems
