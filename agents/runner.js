#!/usr/bin/env node

/**
 * Marketing Agent Runner
 * Orchestrates marketing skills across multiple clients.
 *
 * Usage:
 *   node agents/runner.js list                          # List all clients
 *   node agents/runner.js run <client> <agent>          # Run agent for client
 *   node agents/runner.js run <client> --all            # Run all enabled agents
 *   node agents/runner.js workflow <client> <workflow>   # Run specific workflow
 *   node agents/runner.js status <client>               # Show agent status
 *   node agents/runner.js init <client-name>            # Initialize new client
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const CLIENTS_DIR = path.join(__dirname, '..', 'clients');
const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const TOOLS_DIR = path.join(__dirname, '..', 'tools', 'clis');

// ─────────────────────────────────────────────────────────────────────────────
// YAML Parser (minimal, zero-dep)
// ─────────────────────────────────────────────────────────────────────────────

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
      // Strip inline comments from list items
      if (!val.startsWith('"') && !val.startsWith("'")) {
        val = val.replace(/\s+#.*$/, '');
      }
      val = val.replace(/^["']|["']$/g, '');

      if (Array.isArray(parent)) {
        parent.push(val);
      } else {
        // Convert the empty object to an array in the grandparent
        const grandparent = stack.length > 1 ? stack[stack.length - 2].obj : null;
        const parentKey = top.key;
        if (grandparent && parentKey && typeof parent === 'object' && Object.keys(parent).length === 0) {
          const arr = [val];
          grandparent[parentKey] = arr;
          top.obj = arr;
        } else {
          // Fallback: add to last key of parent
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

    // Handle inline arrays: [val1, val2]
    const colonIdx = content.indexOf(':');
    if (colonIdx === -1) continue;

    const key = content.slice(0, colonIdx).trim();
    const rawVal = content.slice(colonIdx + 1).trim();

    if (!rawVal) {
      parent[key] = {};
      stack.push({ indent, obj: parent[key], key });
    } else if (rawVal.startsWith('[') && rawVal.endsWith(']')) {
      // Inline array: [val1, val2]
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

// ─────────────────────────────────────────────────────────────────────────────
// Client Management
// ─────────────────────────────────────────────────────────────────────────────

function getClients() {
  if (!fs.existsSync(CLIENTS_DIR)) return [];
  return fs.readdirSync(CLIENTS_DIR)
    .filter(f => fs.statSync(path.join(CLIENTS_DIR, f)).isDirectory())
    .filter(f => fs.existsSync(path.join(CLIENTS_DIR, f, 'config.yaml')));
}

function loadClientConfig(clientSlug) {
  const configPath = path.join(CLIENTS_DIR, clientSlug, 'config.yaml');
  if (!fs.existsSync(configPath)) {
    console.error(`Error: No config found for client "${clientSlug}"`);
    console.error(`  Expected: ${configPath}`);
    console.error(`  Run: node agents/runner.js init ${clientSlug}`);
    process.exit(1);
  }
  return parseYaml(fs.readFileSync(configPath, 'utf8'));
}

function loadProductContext(clientSlug) {
  const contextPath = path.join(CLIENTS_DIR, clientSlug, 'product-marketing-context.md');
  if (!fs.existsSync(contextPath)) return null;
  return fs.readFileSync(contextPath, 'utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// Skill Loader
// ─────────────────────────────────────────────────────────────────────────────

function loadSkill(skillName) {
  const skillPath = path.join(SKILLS_DIR, skillName, 'SKILL.md');
  if (!fs.existsSync(skillPath)) {
    console.error(`Error: Skill "${skillName}" not found at ${skillPath}`);
    return null;
  }
  return fs.readFileSync(skillPath, 'utf8');
}

function getSkillReferences(skillName) {
  const refDir = path.join(SKILLS_DIR, skillName, 'references');
  if (!fs.existsSync(refDir)) return [];
  return fs.readdirSync(refDir)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(refDir, f));
}

// ─────────────────────────────────────────────────────────────────────────────
// Agent Execution
// ─────────────────────────────────────────────────────────────────────────────

function buildAgentPrompt(client, agentType, config) {
  const agentConfig = config.agents?.[agentType];
  if (!agentConfig) {
    console.error(`Error: Agent type "${agentType}" not configured for ${client}`);
    process.exit(1);
  }

  if (!agentConfig.enabled) {
    console.error(`Agent "${agentType}" is disabled for ${client}. Enable in config.yaml`);
    process.exit(1);
  }

  const context = loadProductContext(client);
  const skills = (agentConfig.skills || []).map(s => loadSkill(s)).filter(Boolean);

  let prompt = `# Marketing Agent: ${agentType.toUpperCase()}\n`;
  prompt += `# Client: ${config.client?.name || client}\n`;
  prompt += `# URL: ${config.client?.url || 'N/A'}\n`;
  prompt += `# Date: ${new Date().toISOString().split('T')[0]}\n\n`;

  if (context) {
    prompt += `## Product Marketing Context\n\n${context}\n\n`;
  }

  prompt += `## Your Role\n\n`;
  prompt += `You are the ${agentType} agent for ${config.client?.name}. `;
  prompt += `Execute the following skills in sequence, producing actionable output.\n\n`;

  if (agentConfig.focus_pages) {
    prompt += `## Focus Pages\n\n`;
    agentConfig.focus_pages.forEach(p => { prompt += `- ${p}\n`; });
    prompt += '\n';
  }

  prompt += `## Skills to Execute\n\n`;
  skills.forEach((skill, i) => {
    prompt += `### Skill ${i + 1}: ${agentConfig.skills[i]}\n\n`;
    prompt += skill + '\n\n---\n\n';
  });

  prompt += `## Output Requirements\n\n`;
  prompt += `1. Produce a structured report with findings and recommendations\n`;
  prompt += `2. Prioritize actions by impact (high/medium/low)\n`;
  prompt += `3. Include specific, implementable next steps\n`;
  prompt += `4. Reference data from connected tools where available\n`;

  return prompt;
}

function runAgent(clientSlug, agentType) {
  const config = loadClientConfig(clientSlug);
  const prompt = buildAgentPrompt(clientSlug, agentType, config);

  const outputDir = path.join(CLIENTS_DIR, clientSlug, 'reports');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const date = new Date().toISOString().split('T')[0];
  const promptFile = path.join(outputDir, `${agentType}-${date}-prompt.md`);
  fs.writeFileSync(promptFile, prompt);

  console.log(`\n✓ Agent prompt generated: ${promptFile}`);
  console.log(`  Client: ${config.client?.name}`);
  console.log(`  Agent:  ${agentType}`);
  console.log(`  Skills: ${config.agents[agentType].skills.join(', ')}`);
  console.log(`\n  To execute with Claude Code:\n`);
  console.log(`    cat "${promptFile}" | claude --print\n`);
  console.log(`  Or interactively:\n`);
  console.log(`    claude < "${promptFile}"\n`);

  return promptFile;
}

// ─────────────────────────────────────────────────────────────────────────────
// Workflow Execution
// ─────────────────────────────────────────────────────────────────────────────

function runWorkflow(clientSlug, workflowName) {
  const config = loadClientConfig(clientSlug);
  const workflow = config.workflows?.[workflowName];

  if (!workflow) {
    console.error(`Error: Workflow "${workflowName}" not found for ${clientSlug}`);
    console.error(`Available workflows: ${Object.keys(config.workflows || {}).join(', ')}`);
    process.exit(1);
  }

  const context = loadProductContext(clientSlug);
  const date = new Date().toISOString().split('T')[0];

  let prompt = `# Workflow: ${workflowName}\n`;
  prompt += `# Client: ${config.client?.name}\n`;
  prompt += `# Date: ${date}\n\n`;

  if (context) {
    prompt += `## Product Marketing Context\n\n${context}\n\n`;
  }

  prompt += `## Steps\n\n`;
  prompt += `Execute these steps in order:\n\n`;

  (workflow.steps || []).forEach((step, i) => {
    const skill = loadSkill(step.skill);
    prompt += `### Step ${i + 1}: ${step.skill} → ${step.action || 'execute'}\n\n`;
    if (step.params) {
      prompt += `Parameters: ${JSON.stringify(step.params)}\n\n`;
    }
    if (skill) {
      prompt += `<skill>\n${skill}\n</skill>\n\n`;
    }
  });

  const outputDir = path.join(CLIENTS_DIR, clientSlug, 'reports');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const outputFile = (workflow.output || `reports/${workflowName}-{date}.md`)
    .replace('{date}', date)
    .replace('{feature}', 'feature');
  const promptFile = path.join(CLIENTS_DIR, clientSlug, outputFile.replace('.md', '-prompt.md'));

  const promptDir = path.dirname(promptFile);
  if (!fs.existsSync(promptDir)) fs.mkdirSync(promptDir, { recursive: true });

  fs.writeFileSync(promptFile, prompt);

  console.log(`\n✓ Workflow prompt generated: ${promptFile}`);
  console.log(`  Workflow: ${workflowName}`);
  console.log(`  Steps:   ${workflow.steps.length}`);
  console.log(`\n  To execute:\n`);
  console.log(`    cat "${promptFile}" | claude --print\n`);

  return promptFile;
}

// ─────────────────────────────────────────────────────────────────────────────
// Client Initialization
// ─────────────────────────────────────────────────────────────────────────────

function initClient(clientName) {
  const slug = clientName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const clientDir = path.join(CLIENTS_DIR, slug);

  if (fs.existsSync(clientDir)) {
    console.error(`Error: Client directory already exists: ${clientDir}`);
    process.exit(1);
  }

  fs.mkdirSync(clientDir, { recursive: true });
  fs.mkdirSync(path.join(clientDir, 'reports'), { recursive: true });
  fs.mkdirSync(path.join(clientDir, 'logs'), { recursive: true });

  // Copy template config
  const template = fs.readFileSync(path.join(__dirname, 'client-config.yaml'), 'utf8');
  const customized = template
    .replace(/Acme SaaS/g, clientName)
    .replace(/acme-saas/g, slug)
    .replace(/acme\.com/g, `${slug}.com`)
    .replace(/ACME/g, slug.toUpperCase().replace(/-/g, '_'));
  fs.writeFileSync(path.join(clientDir, 'config.yaml'), customized);

  // Create empty product marketing context
  const pmcTemplate = `# Product Marketing Context: ${clientName}

## Product Overview
<!-- What does this product do? Who is it for? -->

## Target Audience / ICP
<!-- Ideal customer profile, demographics, psychographics -->

## Positioning
<!-- How is this product positioned in the market? -->

## Key Differentiators
<!-- What makes this different from competitors? -->

## Voice & Tone
<!-- Brand voice guidelines -->

## Competitors
<!-- Main competitors and how you compare -->

## Key Metrics
<!-- What metrics matter most? -->

## Current Channels
<!-- Where does marketing happen today? -->
`;
  fs.writeFileSync(path.join(clientDir, 'product-marketing-context.md'), pmcTemplate);

  // Create .env template
  const envTemplate = `# ${clientName} - API Keys
# Copy to .env and fill in values (never commit actual keys)

# Analytics
${slug.toUpperCase().replace(/-/g, '_')}_GA4_KEY=
${slug.toUpperCase().replace(/-/g, '_')}_MIXPANEL_KEY=

# Email
${slug.toUpperCase().replace(/-/g, '_')}_EMAIL_KEY=

# CRM
${slug.toUpperCase().replace(/-/g, '_')}_CRM_KEY=

# Ads
${slug.toUpperCase().replace(/-/g, '_')}_GADS_KEY=
${slug.toUpperCase().replace(/-/g, '_')}_META_KEY=

# Payments
${slug.toUpperCase().replace(/-/g, '_')}_STRIPE_KEY=

# SEO
${slug.toUpperCase().replace(/-/g, '_')}_SEO_KEY=

# Notifications
${slug.toUpperCase().replace(/-/g, '_')}_SLACK_WEBHOOK=
${slug.toUpperCase().replace(/-/g, '_')}_RESEND_KEY=
`;
  fs.writeFileSync(path.join(clientDir, '.env.example'), envTemplate);

  console.log(`\n✓ Client initialized: ${clientDir}`);
  console.log(`\n  Created:`);
  console.log(`    ${clientDir}/config.yaml                  — Agent configuration`);
  console.log(`    ${clientDir}/product-marketing-context.md — Fill with client details`);
  console.log(`    ${clientDir}/.env.example                 — API key template`);
  console.log(`    ${clientDir}/reports/                     — Agent output`);
  console.log(`    ${clientDir}/logs/                        — Execution logs`);
  console.log(`\n  Next steps:`);
  console.log(`    1. Fill in product-marketing-context.md with client details`);
  console.log(`    2. Edit config.yaml to enable/disable agents and set integrations`);
  console.log(`    3. Copy .env.example to .env and add API keys`);
  console.log(`    4. Run: node agents/runner.js run ${slug} seo\n`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Status Display
// ─────────────────────────────────────────────────────────────────────────────

function showStatus(clientSlug) {
  const config = loadClientConfig(clientSlug);
  const hasContext = fs.existsSync(path.join(CLIENTS_DIR, clientSlug, 'product-marketing-context.md'));
  const reportsDir = path.join(CLIENTS_DIR, clientSlug, 'reports');
  const reports = fs.existsSync(reportsDir) ? fs.readdirSync(reportsDir) : [];

  console.log(`\n╔══════════════════════════════════════════════╗`);
  console.log(`║  Client: ${(config.client?.name || clientSlug).padEnd(35)}║`);
  console.log(`╠══════════════════════════════════════════════╣`);
  console.log(`║  URL:     ${(config.client?.url || 'Not set').padEnd(34)}║`);
  console.log(`║  Stage:   ${(config.client?.stage || 'Not set').padEnd(34)}║`);
  console.log(`║  Context: ${(hasContext ? '✓ Loaded' : '✗ Missing').padEnd(34)}║`);
  console.log(`║  Reports: ${String(reports.length).padEnd(34)}║`);
  console.log(`╠══════════════════════════════════════════════╣`);
  console.log(`║  AGENTS                                      ║`);
  console.log(`╠══════════════════════════════════════════════╣`);

  const agents = config.agents || {};
  Object.entries(agents).forEach(([name, cfg]) => {
    const status = cfg.enabled ? '✓ ON ' : '✗ OFF';
    const schedule = cfg.schedule || 'manual';
    const skills = Array.isArray(cfg.skills) ? cfg.skills.length : 0;
    console.log(`║  ${status} ${name.padEnd(12)} ${schedule.padEnd(10)} ${skills} skills`.padEnd(47) + '║');
  });

  console.log(`╠══════════════════════════════════════════════╣`);
  console.log(`║  WORKFLOWS                                   ║`);
  console.log(`╠══════════════════════════════════════════════╣`);

  const workflows = config.workflows || {};
  Object.entries(workflows).forEach(([name, wf]) => {
    const trigger = wf.trigger || 'manual';
    const steps = Array.isArray(wf.steps) ? wf.steps.length : 0;
    console.log(`║  ${name.padEnd(25)} ${trigger.padEnd(10)} ${steps} steps`.padEnd(47) + '║');
  });

  console.log(`╚══════════════════════════════════════════════╝\n`);
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI Interface
// ─────────────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  console.log(`
Marketing Agent Runner — Orchestrate skills across clients

Usage:
  node agents/runner.js <command> [options]

Commands:
  list                          List all configured clients
  init <client-name>            Initialize a new client
  run <client> <agent>          Run an agent for a client
  run <client> --all            Run all enabled agents for a client
  workflow <client> <name>      Run a specific workflow
  status <client>               Show client configuration and status

Agent Types:
  seo        SEO audits, content strategy, schema markup
  cro        Conversion optimization across pages and flows
  content    Copywriting, email sequences, social content
  growth     Paid ads, referrals, launch strategy
  revenue    Pricing, churn, RevOps, analytics
  strategy   Ideas, psychology, competitor analysis, A/B tests

Examples:
  node agents/runner.js init "My Startup"
  node agents/runner.js run my-startup seo
  node agents/runner.js run my-startup --all
  node agents/runner.js workflow my-startup weekly-growth-report
  node agents/runner.js status my-startup
`);
  process.exit(0);
}

switch (command) {
  case 'list': {
    const clients = getClients();
    if (clients.length === 0) {
      console.log('\nNo clients configured yet.');
      console.log('  Run: node agents/runner.js init "Client Name"\n');
    } else {
      console.log(`\n${clients.length} client(s) configured:\n`);
      clients.forEach(c => {
        const cfg = loadClientConfig(c);
        const agents = Object.entries(cfg.agents || {}).filter(([, v]) => v.enabled).length;
        console.log(`  • ${c.padEnd(20)} ${cfg.client?.name || ''} (${agents} agents active)`);
      });
      console.log('');
    }
    break;
  }

  case 'init': {
    const name = args.slice(1).join(' ');
    if (!name) {
      console.error('Error: Provide a client name. Example: node agents/runner.js init "My Client"');
      process.exit(1);
    }
    initClient(name);
    break;
  }

  case 'run': {
    const client = args[1];
    const agent = args[2];
    if (!client) {
      console.error('Error: Provide client slug. Example: node agents/runner.js run my-client seo');
      process.exit(1);
    }
    if (agent === '--all') {
      const config = loadClientConfig(client);
      const agents = Object.entries(config.agents || {}).filter(([, v]) => v.enabled);
      console.log(`\nRunning all ${agents.length} enabled agents for ${client}...\n`);
      agents.forEach(([name]) => runAgent(client, name));
    } else if (!agent) {
      console.error('Error: Specify agent type or --all. Example: node agents/runner.js run my-client seo');
      process.exit(1);
    } else {
      runAgent(client, agent);
    }
    break;
  }

  case 'workflow': {
    const client = args[1];
    const workflow = args[2];
    if (!client || !workflow) {
      console.error('Error: Provide client and workflow. Example: node agents/runner.js workflow my-client weekly-growth-report');
      process.exit(1);
    }
    runWorkflow(client, workflow);
    break;
  }

  case 'status': {
    const client = args[1];
    if (!client) {
      console.error('Error: Provide client slug. Example: node agents/runner.js status my-client');
      process.exit(1);
    }
    showStatus(client);
    break;
  }

  default:
    console.error(`Unknown command: ${command}`);
    console.error('Run without arguments to see usage.');
    process.exit(1);
}
