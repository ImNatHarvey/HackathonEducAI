const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');

console.log('\x1b[33m[CLEAN]\x1b[0m Cleaning workspace...');

const targets = [
  'node_modules',
  'frontend/node_modules',
  'frontend/dist',
  'study-aura-youtube-helper/node_modules',
  'study-aura-youtube-helper/tmp/*',
];

targets.forEach(target => {
  const fullPath = path.join(rootDir, target);
  try {
    if (target.includes('*')) {
      // Handle globs/folders
      console.log(`Removing ${target}...`);
      // Simple way to handle globs on win/linux
      const dir = path.dirname(fullPath);
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        files.forEach(file => fs.rmSync(path.join(dir, file), { recursive: true, force: true }));
      }
    } else if (fs.existsSync(fullPath)) {
      console.log(`Removing ${target}...`);
      fs.rmSync(fullPath, { recursive: true, force: true });
    }
  } catch (e) {
    console.log(`Could not remove ${target}: ${e.message}`);
  }
});

console.log('\x1b[32m[SUCCESS]\x1b[0m Workspace cleaned.');
