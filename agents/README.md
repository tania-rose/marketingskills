# Marketing Automation Agents

Turn the 33 marketing skills into autonomous agents that run across all your clients.

## Quick Start

```bash
# 1. Initialize a new client
node agents/runner.js init "My Client"

# 2. Fill in their product context
#    Edit: clients/my-client/product-marketing-context.md

# 3. Configure their agents and integrations
#    Edit: clients/my-client/config.yaml

# 4. Run an agent
node agents/runner.js run my-client seo

# 5. Execute the generated prompt with Claude
cat clients/my-client/reports/seo-2026-04-20-prompt.md | claude --print
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full skills diagram and dependency graph.

## How It Works

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Client Config│────►│ Context Load │────►│ Skill Chain  │────►│   Output     │
│              │     │              │     │              │     │              │
│ config.yaml  │     │ product-mktg │     │ SEO, CRO,   │     │ Reports,     │
│ .env keys    │     │ context.md   │     │ Content etc  │     │ Actions,     │
│ integrations │     │              │     │              │     │ Notifs       │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

## Agent Types

| Agent | Purpose | Default Schedule | Skills |
|-------|---------|-----------------|--------|
| **seo** | Audit rankings, optimize for AI search | Weekly | seo-audit, ai-seo, schema-markup, content-strategy |
| **cro** | Optimize conversions across all pages | Biweekly | page-cro, signup-flow-cro, form-cro, popup-cro, onboarding-cro |
| **content** | Write copy, emails, social posts | Daily | copywriting, email-sequence, social-content |
| **growth** | Run ads, referrals, launches | Weekly | paid-ads, ad-creative, referral-program, launch-strategy |
| **revenue** | Pricing, churn, pipeline ops | Monthly | pricing-strategy, churn-prevention, revops, analytics-tracking |
| **strategy** | Ideas, psychology, testing | On-demand | marketing-ideas, marketing-psychology, competitor-alternatives, ab-test-setup |

## Commands

```bash
node agents/runner.js list                          # List all clients
node agents/runner.js init <client-name>            # Initialize new client
node agents/runner.js run <client> <agent>          # Run specific agent
node agents/runner.js run <client> --all            # Run all enabled agents
node agents/runner.js workflow <client> <workflow>   # Run a workflow
node agents/runner.js status <client>               # Show client status
```

## Scheduling

Run agents automatically with cron:

```bash
# See what's due today
node agents/schedule.js --dry-run

# Generate crontab entries for all clients
node agents/schedule.js --cron

# Install to crontab
node agents/schedule.js --cron | crontab -

# Or run daily and let the scheduler decide
# Add to crontab: 0 9 * * * cd /path/to/marketingskills && node agents/schedule.js
```

## Workflows

Workflows chain multiple skills into multi-step processes:

- **weekly-growth-report** — Pull metrics → review ads → identify drops → suggest improvements
- **monthly-seo-audit** — Full audit → AI visibility → schema validation → gap analysis
- **new-feature-launch** — Plan → landing page → emails → social → ads
- **churn-intervention** — Diagnose → win-back emails → save offer

## Client Directory Structure

```
clients/
└── my-client/
    ├── config.yaml                    # Agent config, integrations, schedules
    ├── product-marketing-context.md   # Foundational positioning (read by all skills)
    ├── .env.example                   # API key template
    ├── reports/                        # Generated reports and prompts
    └── logs/                           # Execution logs
```

## Guardrails

Each client config includes safety limits:

- **require_approval** — Actions that need human sign-off (publish, send, modify ads)
- **auto_approve** — Safe actions (reports, drafts, audits, analytics pulls)
- **max_daily_actions** — Rate limit per client
- **budget_alert_threshold** — Alert before overspending

## Multi-Client Execution

Run the same agent across all clients:

```bash
# Run SEO agent for every client
for client in $(node agents/runner.js list --slugs); do
  node agents/runner.js run "$client" seo
done
```

## Integration with Claude Code

For the most powerful setup, use Claude Code directly:

```bash
# Interactive session with full context
claude --context clients/my-client/product-marketing-context.md

# Pipe agent prompt into Claude
cat clients/my-client/reports/seo-2026-04-20-prompt.md | claude --print

# Use Claude Code schedule for recurring runs
# /schedule "Every Monday at 9am" run SEO agent for all clients
```
