#!/usr/bin/env node

/**
 * Marketing Agent Scheduler
 * Checks which agents are due to run based on client configs and schedules them.
 *
 * Usage:
 *   node agents/schedule.js              # Check what's due today and run
 *   node agents/schedule.js --dry-run    # Show what would run without executing
 *   node agents/schedule.js --cron       # Output crontab entries for all clients
 *
 * Designed to be called daily via cron:
 *   0 9 * * * cd /path/to/marketingskills && node agents/schedule.js >> logs/scheduler.log 2>&1
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CLIENTS_DIR = path.join(__dirname, '..', 'clients');
const RUNNER = path.join(__dirname, 'runner.js');

function parseYaml(text) {
  const lines = text.split('\n');
  const result = {};
  const stack = [{ indent: -1, obj: result, key: null }];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const indent = line.search(/\S/);
    const content = line.trim();

    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    const top = stack[stack.length - 1];
    let parent = top.obj;

    if (content.startsWith('- ')) {
      let val = content.slice(2).trim();
      if (!val.startsWith('"') && !val.startsWith("'")) {
        val = val.replace(/\s+#.*$/, '');
      }
      val = val.replace(/^["']|["']$/g, '');

      if (Array.isArray(parent)) {
        parent.push(val);
      } else {
        const grandparent = stack.length > 1 ? stack[stack.length - 2].obj : null;
        const parentKey = top.key;
        if (grandparent && parentKey && typeof parent === 'object' && Object.keys(parent).length === 0) {
          const arr = [val];
          grandparent[parentKey] = arr;
          top.obj = arr;
        } else {
          const keys = Object.keys(parent);
          const lastKey = keys[keys.length - 1];
          if (lastKey !== undefined) {
            if (Array.isArray(parent[lastKey])) {
              parent[lastKey].push(val);
            } else {
              parent[lastKey] = [val];
            }
          }
        }
      }
      continue;
    }

    const colonIdx = content.indexOf(':');
    if (colonIdx === -1) continue;

    const key = content.slice(0, colonIdx).trim();
    const rawVal = content.slice(colonIdx + 1).trim();

    if (!rawVal) {
      parent[key] = {};
      stack.push({ indent, obj: parent[key], key });
    } else if (rawVal.startsWith('[') && rawVal.endsWith(']')) {
      parent[key] = rawVal.slice(1, -1).split(',')
        .map(v => v.trim().replace(/^["']|["']$/g, ''));
    } else {
      let val = rawVal;
      if (val.startsWith('"')) {
        const endQuote = val.indexOf('"', 1);
        if (endQuote > 0) val = val.slice(0, endQuote + 1);
      } else if (val.startsWith("'")) {
        const endQuote = val.indexOf("'", 1);
        if (endQuote > 0) val = val.slice(0, endQuote + 1);
      } else {
        val = val.replace(/\s+#.*$/, '');
      }
      val = val.replace(/^["']|["']$/g, '');
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      else if (/^\d+(\.\d+)?$/.test(val)) val = Number(val);
      parent[key] = val;
    }
  }

  return result;
}

function getClients() {
  if (!fs.existsSync(CLIENTS_DIR)) return [];
  return fs.readdirSync(CLIENTS_DIR)
    .filter(f => fs.statSync(path.join(CLIENTS_DIR, f)).isDirectory())
    .filter(f => fs.existsSync(path.join(CLIENTS_DIR, f, 'config.yaml')));
}

function isDueToday(schedule, day) {
  const now = new Date();
  const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const dayOfMonth = now.getDate();
  const weekOfMonth = Math.ceil(dayOfMonth / 7);

  switch (schedule) {
    case 'daily':
      return true;
    case 'weekly':
      return dayOfWeek === (day || 'monday');
    case 'biweekly':
      return dayOfWeek === (day || 'monday') && (weekOfMonth === 1 || weekOfMonth === 3);
    case 'monthly':
      return dayOfMonth === (day || 1);
    case 'on-demand':
      return false;
    default:
      return false;
  }
}

function getDueAgents() {
  const due = [];
  const clients = getClients();

  clients.forEach(clientSlug => {
    const configPath = path.join(CLIENTS_DIR, clientSlug, 'config.yaml');
    const config = parseYaml(fs.readFileSync(configPath, 'utf8'));

    Object.entries(config.agents || {}).forEach(([agentType, agentConfig]) => {
      if (!agentConfig.enabled) return;
      if (isDueToday(agentConfig.schedule, agentConfig.day)) {
        due.push({
          client: clientSlug,
          clientName: config.client?.name || clientSlug,
          agent: agentType,
          schedule: agentConfig.schedule,
          skills: agentConfig.skills || []
        });
      }
    });
  });

  return due;
}

function generateCrontab() {
  const clients = getClients();
  const entries = [];

  entries.push('# Marketing Agent Scheduler — Auto-generated crontab entries');
  entries.push(`# Generated: ${new Date().toISOString()}`);
  entries.push('# Add to crontab with: node agents/schedule.js --cron | crontab -');
  entries.push('');

  clients.forEach(clientSlug => {
    const configPath = path.join(CLIENTS_DIR, clientSlug, 'config.yaml');
    const config = parseYaml(fs.readFileSync(configPath, 'utf8'));

    entries.push(`# ─── ${config.client?.name || clientSlug} ───`);

    Object.entries(config.agents || {}).forEach(([agentType, agentConfig]) => {
      if (!agentConfig.enabled || agentConfig.schedule === 'on-demand') return;

      let cron = '';
      const dayMap = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 0 };

      switch (agentConfig.schedule) {
        case 'daily':
          cron = '0 9 * * *';
          break;
        case 'weekly':
          cron = `0 9 * * ${dayMap[agentConfig.day] || 1}`;
          break;
        case 'biweekly':
          cron = `0 9 1-7,15-21 * ${dayMap[agentConfig.day] || 1}`;
          break;
        case 'monthly':
          cron = `0 9 ${agentConfig.day || 1} * *`;
          break;
      }

      if (cron) {
        const cmd = `cd ${path.resolve(__dirname, '..')} && node agents/runner.js run ${clientSlug} ${agentType}`;
        entries.push(`${cron} ${cmd}`);
      }
    });

    entries.push('');
  });

  return entries.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const cronMode = args.includes('--cron');

if (cronMode) {
  console.log(generateCrontab());
  process.exit(0);
}

const due = getDueAgents();
const timestamp = new Date().toISOString();

console.log(`\n[${timestamp}] Marketing Agent Scheduler`);
console.log(`${'─'.repeat(60)}`);

if (due.length === 0) {
  console.log('No agents due today.\n');
  process.exit(0);
}

console.log(`${due.length} agent(s) due today:\n`);

due.forEach(({ client, clientName, agent, schedule, skills }) => {
  console.log(`  • ${clientName} / ${agent} (${schedule})`);
  console.log(`    Skills: ${skills.join(', ')}`);

  if (!dryRun) {
    try {
      const output = execSync(`node "${RUNNER}" run ${client} ${agent}`, { encoding: 'utf8' });
      console.log(`    ✓ Prompt generated`);
    } catch (e) {
      console.log(`    ✗ Error: ${e.message}`);
    }
  } else {
    console.log(`    [dry-run] Would execute: node runner.js run ${client} ${agent}`);
  }
  console.log('');
});

if (dryRun) {
  console.log('(Dry run — no agents were executed)\n');
}
