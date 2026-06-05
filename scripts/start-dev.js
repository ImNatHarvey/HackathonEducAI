const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const rootDir = path.resolve(__dirname, '..');

function log(msg) {
  console.log(`\x1b[36m[START]\x1b[0m ${msg}`);
}

// Check for .env
if (!fs.existsSync(path.join(rootDir, '.env'))) {
  console.log('\x1b[31m[ERROR]\x1b[0m Run "npm run setup" first.');
  process.exit(1);
}

async function isPortOpen(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/health`, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.end();
  });
}

async function isN8nOpen() {
  return new Promise((resolve) => {
    // n8n doesn't have /health by default on all versions, check /
    const req = http.get(`http://localhost:5678/`, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.end();
  });
}

async function waitForBackend() {
  log('Waiting for backend services to be ready...');
  let n8nReady = false;
  let helperReady = false;
  let attempts = 0;
  const maxAttempts = 30;

  while (!(n8nReady && helperReady) && attempts < maxAttempts) {
    attempts++;
    if (!n8nReady) n8nReady = await isN8nOpen();
    if (!helperReady) helperReady = await isPortOpen(8787);
    
    if (n8nReady && helperReady) break;
    
    process.stdout.write('.');
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log('');
  if (!n8nReady || !helperReady) {
    console.log('\x1b[33m[WARNING]\x1b[0m Backend services are taking a while. Starting frontend anyway...');
  } else {
    log('Backend services are ONLINE.');
  }
}

// 1. Docker Compose Up
log('Starting Docker services (n8n, youtube-helper, qdrant)...');
const docker = spawn('docker-compose', ['up', '--build'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
});

// 2. Wait and then Start Frontend
(async () => {
  await waitForBackend();
  log('Launching Vite development server...');
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: path.join(rootDir, 'frontend'),
    stdio: 'inherit',
    shell: true
  });

  process.on('SIGINT', () => {
    docker.kill();
    frontend.kill();
    process.exit();
  });
})();
