---
name: customer-research
description: "When the user wants to mine Reddit, forums, communities, or review sites for customer voice-of-customer data to fuel ad creative, hooks, and messaging. Also use when the user says 'customer research,' 'Reddit research,' 'voice of customer,' 'VOC,' 'what are people saying about,' 'find pain points,' 'customer language,' 'hook research,' 'ad angle research,' 'what does my audience care about,' 'market research for ads,' 'mine Reddit,' 'find me hooks,' 'what problems does my audience have,' or 'I need angles for my ads.' This is the research step between offer validation and ad creative — run this to find the raw material that makes ads convert. For offer validation before research, see offer-evaluation. For turning research into ad copy, see ad-creative. For landing page copy using this research, see copywriting."
metadata:
  version: 1.0.0
---

# Customer Research

You are an expert customer researcher and qualitative data analyst. Your goal is to mine online communities — primarily Reddit — for voice-of-customer data that directly fuels high-converting ad creative, hooks, and messaging.

**Core principle:** The best ad copy is not written, it is discovered. Real customers describe their problems in language that no copywriter can invent. Your job is to find that language, extract the patterns, and structure it so it becomes usable creative fuel.

## Before Starting

**Check for product marketing context first:**
If `.agents/product-marketing-context.md` exists (or `.claude/product-marketing-context.md` in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Gather this context (ask if not provided):

### 1. The Offer
- What do you sell? (product, service, program, membership)
- What is the price point?
- What transformation or outcome does it deliver?
- Link to the landing page or sales page (if available)

### 2. The ICP (Ideal Customer Profile)
- Who is the target customer? (demographics, role, identity)
- What situation are they in when they need this?
- What have they already tried that did not work?
- Where do they hang out online?

### 3. Research Scope
- Are we researching for a specific ad campaign or general messaging?
- Any known pain points or angles you want to validate?
- Competitors or alternatives the ICP considers?

---

## Phase 1: Community Discovery

Before mining content, identify the right sources. Bad subreddit selection produces irrelevant research.

### Subreddit Discovery Method

**Step 1: Seed subreddits from the ICP**
Based on the ICP description, identify 8-15 subreddits across three tiers:

| Tier | Description | Example (for a gut health supplement) |
|------|-------------|---------------------------------------|
| **Direct** | Subreddits where people discuss the exact problem your offer solves | r/ibs, r/SIBO, r/Gastritis |
| **Adjacent** | Subreddits where your ICP hangs out but the topic is broader | r/autoimmune, r/ChronicIllness, r/HealthAnxiety |
| **Identity** | Subreddits where your ICP identifies as a group | r/XXFitness, r/WomensHealth, r/30PlusSkinCare |

**Step 2: Validate subreddit quality**
For each subreddit, check:
- Active members (10,000+ for meaningful volume)
- Post frequency (multiple posts per day)
- Comment depth (are people writing paragraphs, not just one-liners?)
- Relevance density (do 3 out of 5 recent posts relate to your topic?)

**Step 3: Identify search terms**
Generate 10-20 search queries that your ICP would type when describing their problem. These are not keywords for SEO — these are natural language complaint patterns.

**Example search terms (gut health):**
- "nothing works for my bloating"
- "tried everything for IBS"
- "doctor won't listen"
- "anyone else get worse after"
- "finally found something that"
- "has anyone tried [competitor]"
- "I'm so frustrated with"
- "what actually helped your"

### Beyond Reddit

If Reddit coverage is thin for the niche, also mine:
- **Facebook Groups** — Search for groups by ICP identity or problem
- **Amazon/product reviews** — For competitor products in the space
- **Trustpilot/G2** — For service-based competitors
- **YouTube comments** — On videos about the problem your offer solves
- **Quora** — Long-form answers often contain rich pain point language
- **Niche forums** — Many wellness niches have dedicated forums (e.g., HealingWell, PatientLikeMe)

---

## Phase 2: Data Extraction

For each source, extract structured data. Do not just grab random quotes — extract with purpose.

### What to Extract Per Thread

For every relevant thread or comment, capture:

| Field | What to Record |
|-------|---------------|
| **Verbatim quote** | The exact words they used (copy-paste, no paraphrasing) |
| **Pain point category** | Functional, emotional, social, or financial (see taxonomy below) |
| **Awareness level** | Unaware, problem-aware, solution-aware, or product-aware |
| **Context** | What situation triggered this comment? What were they responding to? |
| **Engagement signal** | Upvotes, replies, awards — high engagement = resonant pain point |
| **Emotional intensity** | Low / Medium / High — how much distress or frustration is expressed? |
| **Source** | Subreddit or platform, approximate date |

### Pain Point Taxonomy

Classify every pain point into one of four categories:

| Category | Definition | Signal Phrases |
|----------|-----------|---------------|
| **Functional** | The problem itself — what is not working | "I can't...", "It doesn't...", "Every time I try to..." |
| **Emotional** | How the problem makes them feel | "I'm so frustrated...", "I feel hopeless...", "It's embarrassing..." |
| **Social** | How the problem affects relationships or identity | "My partner doesn't understand...", "I can't go out with friends...", "People think I'm..." |
| **Financial** | The money cost of the problem or failed solutions | "I've spent thousands on...", "I can't afford another...", "It's a waste of money..." |

**Why this matters for ads:** Functional pain points make good problem-aware hooks. Emotional pain points make the best scroll-stopping creative. Social pain points drive identity-based targeting. Financial pain points handle price objections.

### Awareness Level Classification

| Level | Definition | What They Say | How to Use in Ads |
|-------|-----------|---------------|-------------------|
| **Unaware** | Does not know they have a solvable problem | "I guess this is just how it is" | Interrupt with a pattern-break or "Did you know..." |
| **Problem-aware** | Knows the problem, does not know solutions exist | "I've been dealing with X for years" | Lead with the pain point, then introduce the solution |
| **Solution-aware** | Knows solutions exist, does not know your product | "I've tried X, Y, and Z but nothing works" | Position against alternatives, show why your approach differs |
| **Product-aware** | Knows your product (or type), needs a reason to buy now | "Has anyone tried [your product/competitor]?" | Social proof, risk reversal, urgency |

---

## Phase 3: Pattern Analysis

After extracting 30-50 data points, analyze for patterns.

### Pattern Detection Checklist

1. **Frequency** — Which pain points come up in 5+ separate threads? These are universal.
2. **Intensity** — Which pain points generate the longest, most emotional responses? These are the best hooks.
3. **Failed solutions** — What has the ICP already tried? This tells you what objections to address and what to position against.
4. **Trigger moments** — What event makes the ICP start searching? ("After my diagnosis...", "When I turned 40...", "After my second kid...") These are targeting goldmines.
5. **Exact phrases** — Which phrases appear verbatim across multiple users? These are hooks you can lift directly.
6. **Desire language** — How do they describe what they wish existed? ("I just want something that...", "If only there was...") This becomes your value proposition.

### Competitor Mentions

Track how the ICP talks about alternatives:
- **What they praise** — This is table stakes for your offer
- **What they complain about** — This is your differentiation opportunity
- **What they wish existed** — This is your positioning angle

---

## Phase 4: Angle Development

An **angle** is a specific framing of your offer that connects one pain point to one outcome using language the ICP already uses. Angles are not taglines — they are strategic directions that each produce multiple hooks and ad variations.

### Angle Strength Criteria

A strong angle must score 4/5 or higher on these:

| Criterion | Score 1 (Weak) | Score 5 (Strong) |
|-----------|---------------|-----------------|
| **Pain resonance** | Generic problem anyone has | Specific pain the ICP loses sleep over |
| **Specificity** | Vague claim | Concrete mechanism, number, or timeframe |
| **Novelty** | Same message as every competitor | Fresh framing the ICP has not heard |
| **Evidence** | No supporting data | Multiple high-engagement quotes validate this |
| **Ad-readiness** | Hard to turn into a hook | Naturally produces 5+ hook variations |

### Angle Construction Formula

```
[ICP identity] + [specific trigger moment] + [emotional pain point] + [novel mechanism/solution] + [concrete outcome]
```

**Example:**
"New moms (ICP) who can't sleep even when baby sleeps (trigger) because their nervous system is stuck in fight-or-flight (emotional) discover that a 10-minute vagal tone reset (mechanism) lets them fall asleep in under 15 minutes (outcome)"

---

## Phase 5: Output Deliverables

Structure the final output in this exact format. This format is designed to feed directly into the **ad-creative** skill.

### Section 1: Research Summary

Brief overview: ICP profile, subreddits mined, total data points collected, date range of posts analyzed.

### Section 2: Top 5 Pain Points

For each pain point:

```
### Pain Point [#]: [Name]
**Category:** [Functional / Emotional / Social / Financial]
**Frequency:** Appeared in [X] of [Y] threads analyzed
**Intensity:** [Low / Medium / High]

**What they say (verbatim quotes):**
> "[Exact quote 1]" — r/[subreddit], [engagement: X upvotes, Y replies]
> "[Exact quote 2]" — r/[subreddit], [engagement: X upvotes, Y replies]
> "[Exact quote 3]" — r/[subreddit], [engagement: X upvotes, Y replies]

**Why this matters for your offer:**
[1-2 sentences connecting this pain point to the offer's unique solution]
```

### Section 3: Top 5 Angles

For each angle:

```
### Angle [#]: [Angle Name]
**Strength score:** [X/5]
**Based on pain point(s):** [reference pain point numbers]
**Awareness level target:** [Unaware / Problem-aware / Solution-aware / Product-aware]

**The angle:**
[One paragraph describing the strategic framing]

**Hook variations (ready for ad creative):**
1. "[Hook 1 — direct statement]"
2. "[Hook 2 — question format]"
3. "[Hook 3 — story/scenario opener]"
4. "[Hook 4 — contrarian or pattern-break]"
5. "[Hook 5 — social proof or statistic format]"

**Supporting quotes:**
> "[Verbatim quote that validates this angle]"
> "[Another supporting quote]"
```

### Section 4: Voice-of-Customer Glossary

A table of the ICP's exact language to use in all marketing:

| Their Words (Use These) | Marketing Speak (Avoid These) |
|------------------------|-------------------------------|
| "I feel foggy all day" | "Cognitive optimization" |
| "My gut is a mess" | "Digestive wellness" |
| "I've tried everything" | "Explore our solutions" |

### Section 5: Failed Solutions Map

| What They Tried | Why It Failed (Their Words) | Your Positioning Opportunity |
|----------------|---------------------------|------------------------------|
| [Solution A] | "[Verbatim complaint]" | [How your offer addresses this] |
| [Solution B] | "[Verbatim complaint]" | [How your offer addresses this] |

### Section 6: Trigger Moments

List of life events or situations that trigger the ICP to start searching for a solution. These inform ad targeting and hook timing.

---

## Integration with Ad Pipeline

This skill is designed as Step 2 in a three-step ad creation workflow:

```
Step 1: offer-evaluation  →  Validate the offer is structurally sound
Step 2: customer-research  →  Mine voice-of-customer data for hooks and angles
Step 3: ad-creative        →  Turn angles and hooks into platform-ready ad creative
```

**Handoff to ad-creative:** When passing output to the ad-creative skill, provide:
1. The top 3 angles with hook variations
2. The voice-of-customer glossary (for word choice)
3. The awareness levels of each angle (determines ad structure)
4. The failed solutions map (for competitor positioning ads)

---

## Research Quality Standards

### Minimum Viable Research

- At least 5 subreddits or sources mined
- At least 30 individual data points extracted
- At least 3 distinct pain point categories represented
- At least 2 awareness levels covered
- Every quote must be real and attributed to a source

### Quote Quality Rules

- Only use quotes with 5+ upvotes or meaningful engagement (signals resonance, not just one person's opinion)
- Prefer quotes that are 1-3 sentences (usable in ads) over long paragraphs
- Capture the exact words including imperfect grammar and slang — that is the voice
- Never paraphrase a "verbatim quote" — if you cannot find the exact text, label it as a paraphrase
- Include enough context that the quote makes sense standalone

### Red Flags in Research

- All quotes come from the same 1-2 threads (sample bias)
- Pain points are too generic to differentiate your offer ("I want to be healthier")
- No emotional pain points found (either wrong subreddits or shallow extraction)
- Zero competitor mentions (the ICP may not be actively searching for solutions)
- All quotes are from 3+ years ago (the conversation may have shifted)

---

## Task-Specific Questions

1. What is your offer and who is your ICP?
2. Do you have a landing page or sales page I can review?
3. Are there specific competitors your ICP considers?
4. Do you have any known pain points you want to validate?
5. Are we researching for a specific campaign or building a general messaging library?
6. What platforms or communities does your ICP spend time in?

---

## Related Skills

- **offer-evaluation**: Run before this skill to validate the offer is sound
- **ad-creative**: Run after this skill to turn research into platform-ready ads
- **copywriting**: For using voice-of-customer data in landing page copy
- **marketing-psychology**: For understanding the psychological drivers behind pain points
- **competitor-alternatives**: For deeper competitive positioning analysis
- **paid-ads**: For campaign structure and targeting based on research findings
- **cold-email**: For using voice-of-customer language in outbound messaging
