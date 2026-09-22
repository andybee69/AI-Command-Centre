# Mintsoft Stock Analysis

Purpose: analyse AGON UK stock and usage data to support replenishment decisions.

## Inputs
- Current inventory
- Product usage history
- Product master data
- Denmark availability where known
- Approximate China production lead time
- Known customer/project demand

## Check
- Fast-moving items
- Slow-moving items
- Stockout risk
- Overstock risk
- Usage trend
- Average monthly usage
- Suggested minimum stock
- Suggested maximum stock
- Reorder point
- Items needing human review

## Rules
- Mintsoft is the stock authority
- Use actual usage history where possible
- Do not make purchasing decisions automatically
- Flag unusual demand spikes
- Consider long manufacturing lead times separately from Denmark-to-UK transfers

## Output
- Product
- Current stock
- Usage rate
- Risk
- Suggested min
- Suggested max
- Reorder recommendation
- Confidence
- Notes
