# Yogahub Meta Ads Account Analysis

**Date:** 2025-05-25
**Vertical:** Professional Services / Fitness
**Business:** yogahub (Business ID: 814789868612335)

---

## Account Inventory

Yogahub has **4 ad accounts** under the yogahub business:

| Account ID | Name | Status | Currency | MCP Enabled | Queryable |
|---|---|---|---|---|---|
| 62197313 | (unnamed) | UNSETTLED | USD | Yes | No |
| 10153500099687481 | (unnamed) | UNSETTLED | USD | Yes | No |
| 783787830142937 | yogahub | UNSETTLED | EUR | Yes | No |
| 1618487615633377 | 2024 Ad Account yogahub | ACTIVE | EUR | No | Yes |

---

## Key Findings

### 1. Critical Issue: 3 of 4 Accounts Are UNSETTLED

The three MCP-enabled accounts (62197313, 10153500099687481, 783787830142937) are all in **UNSETTLED** status. This typically means:

- **Outstanding balance** that hasn't been paid
- **Payment method failure** (expired card, insufficient funds, declined charge)
- **Billing threshold or invoice issue**

As a result, **no ads are running** on these accounts and no performance data is available for analysis.

### 2. Active Account Has Limited Tooling Access

Account `1618487615633377` ("2024 Ad Account yogahub") is **ACTIVE** with a valid payment method but does not currently have MCP access enabled. This means automated analysis through the ads API tools is unavailable for this account at this time.

### 3. No Performance Data Available

Across all four accounts, the following returned no data:
- Performance trends (CPC, CPM, CTR, ROAS, CVR, CPR)
- Industry benchmarks (vs. similar Fitness advertisers)
- Auction ranking benchmarks
- Anomaly detection signals
- Opportunity score recommendations

### 4. Advertiser Context Confirmed

All three MCP-enabled accounts are correctly classified as:
- **Vertical:** Professional Services
- **Sub-Vertical:** Fitness

This is relevant for future benchmarking against other fitness/wellness advertisers.

---

## Immediate Action Items

### Priority 1: Resolve Billing on Unsettled Accounts

1. Go to **Meta Business Settings** > **Payment Settings** for the yogahub business
2. Check each unsettled account for outstanding balances
3. Update payment methods if expired/declined
4. Pay any outstanding balances to reactivate the accounts

Accounts to fix:
- `act_62197313` (USD)
- `act_10153500099687481` (USD)
- `act_783787830142937` (EUR)

### Priority 2: Consolidate Ad Accounts

Having 4 accounts for one business fragments budget, audience learning, and pixel data. Recommend:

- **Keep 1 primary account** (likely `1618487615633377` since it's active, EUR-based)
- **Close or archive** unused/duplicate accounts after settling balances
- If you need both USD and EUR billing, keep one of each

### Priority 3: Set Up for Future Analysis

Once accounts are active and running ads:
- Ensure the **Meta Pixel** is installed and firing conversion events
- Run campaigns for at least **7 days** to generate enough data for trend analysis
- Aim for **50+ conversions** per ad set per week for reliable optimization signals

---

## Recommended Campaign Strategy (Post-Fix)

Based on the Fitness sub-vertical and the paid-ads skill framework:

### Platform Fit
Meta (Facebook/Instagram) is strong for fitness businesses because:
- Visual product (yoga classes, studio imagery, instructor videos)
- Demand generation (people don't search for yoga studios, they discover them)
- Strong lookalike audience capabilities for local businesses

### Suggested Campaign Structure

```
yogahub Ad Account
├── Campaign 1: META_Awareness_Broad_YogaClasses
│   └── Ad Set: Local area targeting, interest-based (yoga, wellness, fitness)
├── Campaign 2: META_Conv_Lookalike_ClassBooking
│   └── Ad Set: Lookalike based on existing students
├── Campaign 3: META_Retarget_WebVisitors_TrialOffer
│   └── Ad Set: Website visitors (7-30 days), excluding converters
```

### Budget Allocation (Testing Phase)
- 70% to proven/safe campaigns (awareness + retargeting)
- 30% to testing new audiences and creative

### Key Metrics to Track
| Objective | Primary Metrics |
|-----------|----------------|
| Awareness | CPM, Reach, Video view rate |
| Class Bookings | CPA, ROAS, Conversion rate |
| Retargeting | CPA, Frequency (watch for fatigue) |

---

## Next Steps

1. **Fix billing** on unsettled accounts
2. **Consolidate** to 1-2 active accounts
3. **Install/verify** Meta Pixel on yogahub website
4. **Launch** initial test campaigns with structured naming
5. **Re-run this analysis** after 2+ weeks of active campaigns for actionable performance insights
