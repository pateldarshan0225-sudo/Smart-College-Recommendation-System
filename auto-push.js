const { execFileSync } = require('child_process');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname);
const POLL_INTERVAL_MS = 15000; // Check every 15 seconds
const DEBOUNCE_WAIT_MS = 8000;  // Debounce 8 seconds after changes detected

function log(msg, color = '\x1b[36m') {
  const time = new Date().toLocaleTimeString();
  console.log(`${color}[${time}] ${msg}\x1b[0m`);
}

function runGit(args) {
  return execFileSync('git', args, {
    cwd: ROOT_DIR,
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe']
  }).trim();
}

function getStatus() {
  try {
    return runGit(['status', '--porcelain']);
  } catch (err) {
    return null;
  }
}

function getAheadCount() {
  try {
    const count = runGit(['rev-list', '@{u}..HEAD', '--count']);
    return parseInt(count, 10) || 0;
  } catch {
    return 0;
  }
}

function getCurrentBranch() {
  try {
    return runGit(['rev-parse', '--abbrev-ref', 'HEAD']) || 'main';
  } catch {
    return 'main';
  }
}

let isProcessing = false;

async function checkAndSync() {
  if (isProcessing) return;

  const changes = getStatus();
  const branch = getCurrentBranch();

  if (changes) {
    isProcessing = true;
    const lines = changes.split('\n').filter(Boolean);
    log(`Detected ${lines.length} changed file(s). Waiting ${DEBOUNCE_WAIT_MS / 1000}s for edits to settle...`, '\x1b[33m');

    await new Promise(r => setTimeout(r, DEBOUNCE_WAIT_MS));

    const currentChanges = getStatus();
    if (!currentChanges) {
      log('Changes reverted or already clean. Skipping.', '\x1b[90m');
      isProcessing = false;
      return;
    }

    const updatedLines = currentChanges.split('\n').filter(Boolean);
    const sampleFiles = updatedLines
      .slice(0, 3)
      .map(l => l.trim().split(/\s+/).slice(1).join(' ') || l.trim())
      .join(', ');
    const moreCount = updatedLines.length > 3 ? ` (+${updatedLines.length - 3} more)` : '';
    const now = new Date().toLocaleString();
    const commitMsg = `Auto-update: ${now} [${sampleFiles}${moreCount}]`;

    try {
      log(`Staging ${updatedLines.length} changed file(s)...`, '\x1b[34m');
      runGit(['add', '.']);

      log(`Committing: "${commitMsg}"...`, '\x1b[34m');
      runGit(['commit', '-m', commitMsg]);
    } catch (err) {
      log(`[ERROR] Commit failed: ${err.message}`, '\x1b[31m');
      isProcessing = false;
      return;
    }
    isProcessing = false;
  }

  // Push if we have commits ahead of origin
  const ahead = getAheadCount();
  if (ahead > 0) {
    isProcessing = true;
    try {
      log(`Pushing ${ahead} commit(s) to origin/${branch}...`, '\x1b[35m');
      runGit(['push', 'origin', branch]);
      log(`[SUCCESS] Changes pushed to GitHub successfully! (Branch: ${branch})`, '\x1b[32m');
    } catch (err) {
      const errMsg = err.stderr ? err.stderr.toString().trim() : err.message;
      log(`[WARNING] Push failed (will retry automatically): ${errMsg}`, '\x1b[31m');
    } finally {
      isProcessing = false;
    }
  }
}

console.log('\x1b[32m====================================================\x1b[0m');
console.log('\x1b[1m\x1b[36m   Smart College Repo - Auto-Sync Watcher Active    \x1b[0m');
console.log('\x1b[32m====================================================\x1b[0m');
console.log(`Repository Directory:  ${ROOT_DIR}`);
console.log(`Tracking Branch:       origin/${getCurrentBranch()}`);
console.log(`Check Interval:        Every ${POLL_INTERVAL_MS / 1000} seconds`);
console.log(`Debounce Delay:        ${DEBOUNCE_WAIT_MS / 1000} seconds after file save`);
console.log('\n\x1b[32m[READY]\x1b[0m Watching for file changes. Any saved changes will automatically be committed and pushed to GitHub.');
console.log('Keep this window open while working. Press Ctrl+C to stop.\n');

setInterval(checkAndSync, POLL_INTERVAL_MS);
checkAndSync();
