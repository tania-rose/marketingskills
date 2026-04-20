# Marketing Automation Agents — Architecture

## Skills Ecosystem Diagram

```
╔══════════════════════════════════════════════════════════════════════════════════════════╗
║                           MARKETING AUTOMATION AGENTS                                   ║
║                                                                                         ║
║  ┌─────────────────────────────────────────────────────────────────────────────────┐    ║
║  │                        FOUNDATION LAYER                                          │    ║
║  │                                                                                  │    ║
║  │   ┌────────────────────────────────────────────────────────────────────────┐     │    ║
║  │   │              product-marketing-context                                  │     │    ║
║  │   │     (All 33 skills read this first — one per client)                    │     │    ║
║  │   │     Defines: ICP, positioning, voice, competitors, product details      │     │    ║
║  │   └────────────────────────────────────────────────────────────────────────┘     │    ║
║  └──────────────────────────────────────┬──────────────────────────────────────────┘    ║
║                                          │                                               ║
║                    reads context          │          reads context                        ║
║         ┌──────────┬──────────┬──────────┼──────────┬──────────┬──────────┐             ║
║         ▼          ▼          ▼          ▼          ▼          ▼          ▼             ║
║  ┌─────────────────────────────────────────────────────────────────────────────────┐    ║
║  │                         SKILL CLUSTERS                                           │    ║
║  │                                                                                  │    ║
║  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐    │    ║
║  │  │  ACQUIRE    │  │  CONVERT    │  │   RETAIN    │  │    EXPAND           │    │    ║
║  │  │  (Traffic)  │  │  (Signup)   │  │  (Loyalty)  │  │   (Revenue)         │    │    ║
║  │  ├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────────────┤    │    ║
║  │  │seo-audit    │  │page-cro     │  │churn-prevent│  │pricing-strategy     │    │    ║
║  │  │ai-seo       │  │signup-flow  │  │onboarding   │  │paywall-upgrade-cro  │    │    ║
║  │  │content-strat│  │form-cro     │  │email-seq    │  │referral-program     │    │    ║
║  │  │programm-seo │  │popup-cro    │  │             │  │revops               │    │    ║
║  │  │site-arch    │  │copywriting  │  │             │  │sales-enablement     │    │    ║
║  │  │schema-markup│  │copy-editing │  │             │  │                     │    │    ║
║  │  │social-cont  │  │lead-magnets │  │             │  │                     │    │    ║
║  │  │paid-ads     │  │             │  │             │  │                     │    │    ║
║  │  │ad-creative  │  │             │  │             │  │                     │    │    ║
║  │  │cold-email   │  │             │  │             │  │                     │    │    ║
║  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘    │    ║
║  │         │                │                 │                     │               │    ║
║  │         └────────────────┴────────┬────────┴─────────────────────┘               │    ║
║  │                                   │                                              │    ║
║  │  ┌────────────────────────────────┴────────────────────────────────────────┐     │    ║
║  │  │                    CROSS-CUTTING SKILLS                                  │     │    ║
║  │  │                                                                          │     │    ║
║  │  │  marketing-psychology │ ab-test-setup │ analytics-tracking               │     │    ║
║  │  │  marketing-ideas      │ launch-strategy │ free-tool-strategy             │     │    ║
║  │  │  competitor-alts      │                                                  │     │    ║
║  │  └─────────────────────────────────────────────────────────────────────────┘     │    ║
║  └──────────────────────────────────────────────────────────────────────────────────┘    ║
║                                          │                                               ║
║                                          ▼                                               ║
║  ┌─────────────────────────────────────────────────────────────────────────────────┐    ║
║  │                        TOOL INTEGRATION LAYER                                    │    ║
║  │                                                                                  │    ║
║  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────────────┐ │    ║
║  │  │ Analytics │ │   SEO     │ │  Email    │ │  Ads      │ │  CRM / RevOps     │ │    ║
║  │  ├───────────┤ ├───────────┤ ├───────────┤ ├───────────┤ ├───────────────────┤ │    ║
║  │  │ga4        │ │semrush    │ │customer-io│ │google-ads │ │hubspot            │ │    ║
║  │  │mixpanel   │ │ahrefs     │ │mailchimp  │ │meta-ads   │ │salesforce         │ │    ║
║  │  │amplitude  │ │dataforseo │ │resend     │ │linkedin   │ │close              │ │    ║
║  │  │posthog    │ │gsc        │ │sendgrid   │ │tiktok-ads │ │clearbit           │ │    ║
║  │  │segment    │ │keywords   │ │kit        │ │           │ │apollo             │ │    ║
║  │  │plausible  │ │           │ │klaviyo    │ │           │ │zapier             │ │    ║
║  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────────────┘ │    ║
║  │                                                                                  │    ║
║  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────────────┐ │    ║
║  │  │ Payments  │ │ Referral  │ │ Outreach  │ │  Social   │ │  Composio (MCP)   │ │    ║
║  │  ├───────────┤ ├───────────┤ ├───────────┤ ├───────────┤ ├───────────────────┤ │    ║
║  │  │stripe     │ │rewardful  │ │hunter     │ │buffer     │ │  Unified MCP for  │ │    ║
║  │  │paddle     │ │tolt       │ │snov       │ │wistia     │ │  500+ tools w/o   │ │    ║
║  │  │           │ │dub-co     │ │lemlist    │ │           │ │  native MCP:      │ │    ║
║  │  │           │ │mention-me │ │instantly  │ │           │ │  HubSpot, Meta,   │ │    ║
║  │  │           │ │partnerstack│ │outreach  │ │           │ │  LinkedIn, Slack  │ │    ║
║  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────────────┘ │    ║
║  └──────────────────────────────────────────────────────────────────────────────────┘    ║
╚══════════════════════════════════════════════════════════════════════════════════════════╝
```

## Skill Dependency Graph (Cross-References)

```
                    ┌──────────────────────────────────────────────────────────────┐
                    │                   SEO CLUSTER                                 │
                    │                                                               │
                    │   seo-audit ◄──► ai-seo ◄──► schema-markup                   │
                    │       ▲              ▲              ▲                         │
                    │       │              │              │                         │
                    │       ▼              ▼              ▼                         │
                    │   site-arch ◄──► programmatic-seo ◄──► competitor-alts        │
                    │       ▲                                      ▲                │
                    │       │                                      │                │
                    │       ▼                                      ▼                │
                    │   content-strategy ─────────────────► sales-enablement        │
                    └───────┬──────────────────────────────────────┬────────────────┘
                            │                                      │
                            ▼                                      ▼
                    ┌──────────────────────────────────────────────────────────────┐
                    │                 CONVERSION CLUSTER                            │
                    │                                                               │
                    │   page-cro ◄──► copywriting ◄──► copy-editing                │
                    │       ▲              ▲                                        │
                    │       │              │                                        │
                    │       ▼              ▼                                        │
                    │   signup-flow ──► onboarding ──► paywall-upgrade              │
                    │       ▲                              ▲                        │
                    │       │                              │                        │
                    │       ▼                              ▼                        │
                    │   form-cro    popup-cro         churn-prevention              │
                    │       ▲          ▲                    ▲                       │
                    │       │          │                    │                       │
                    │       ▼          ▼                    ▼                       │
                    │   lead-magnets ──────────────► email-sequence                 │
                    └───────┬──────────────────────────────┬───────────────────────┘
                            │                              │
                            ▼                              ▼
                    ┌──────────────────────────────────────────────────────────────┐
                    │              GROWTH & REVENUE CLUSTER                         │
                    │                                                               │
                    │   paid-ads ◄──► ad-creative         referral-program          │
                    │       ▲                                   ▲                   │
                    │       │                                   │                   │
                    │       ▼                                   ▼                   │
                    │   analytics-tracking ◄──► ab-test-setup  launch-strategy      │
                    │       ▲                                   ▲                   │
                    │       │                                   │                   │
                    │       ▼                                   ▼                   │
                    │   revops ◄──► pricing-strategy ◄──► marketing-psychology      │
                    │       ▲                                                       │
                    │       │                                                       │
                    │       ▼                                                       │
                    │   cold-email ◄──► social-content   free-tool-strategy         │
                    └──────────────────────────────────────────────────────────────┘
```

## Agent Workflow Model

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           PER-CLIENT AGENT LOOP                                  │
│                                                                                  │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │  CLIENT  │    │   CONTEXT    │    │  WORKFLOW     │    │    EXECUTE       │  │
│  │  CONFIG  │───►│   LOADER     │───►│  ROUTER      │───►│    SKILLS        │  │
│  │          │    │              │    │              │    │                  │  │
│  │ • name   │    │ Loads PMC    │    │ Picks skills │    │ Runs skill chain │  │
│  │ • keys   │    │ per client   │    │ per workflow │    │ with tool calls  │  │
│  │ • goals  │    │              │    │              │    │                  │  │
│  └──────────┘    └──────────────┘    └──────────────┘    └────────┬─────────┘  │
│                                                                    │            │
│                                                                    ▼            │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │                         OUTPUT & REPORTING                                │  │
│  │                                                                           │  │
│  │  • Recommendations saved to clients/{name}/reports/                       │  │
│  │  • Actions executed via CLI tools (ga4, stripe, mailchimp, etc.)          │  │
│  │  • Notifications sent (Slack, email) on completion                        │  │
│  │  • Logs stored in clients/{name}/logs/                                    │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Agent Types (Mapped to Skill Clusters)

| Agent Type | Skills Used | Cadence | Output |
|------------|-------------|---------|--------|
| **SEO Agent** | seo-audit, ai-seo, schema-markup, site-architecture, programmatic-seo, content-strategy | Weekly | Audit report + action items |
| **CRO Agent** | page-cro, signup-flow-cro, form-cro, popup-cro, onboarding-cro, paywall-upgrade-cro | Bi-weekly | Test hypotheses + wireframes |
| **Content Agent** | copywriting, copy-editing, email-sequence, social-content, cold-email | Daily | Draft content + schedules |
| **Growth Agent** | paid-ads, ad-creative, referral-program, free-tool-strategy, launch-strategy | Weekly | Campaign recommendations |
| **Revenue Agent** | pricing-strategy, churn-prevention, revops, sales-enablement, analytics-tracking | Monthly | Revenue analysis + playbooks |
| **Strategy Agent** | marketing-ideas, marketing-psychology, competitor-alternatives, ab-test-setup | On-demand | Strategic briefs |
