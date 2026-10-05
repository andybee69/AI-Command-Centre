# UX Harvest — Command Centre

## Rule
When Andy shares an app, reel, dashboard or workflow with a genuinely useful idea, **harvest the pattern rather than adding another platform by default**.

The test is simple:
1. What does the screen/workflow do unusually well?
2. Can we reproduce that benefit inside the existing Command Centre?
3. Does it reduce clicks, confusion, duplicated data or manual checking?
4. If yes, add it to the existing build. If no, record it as reference only.

## Current reference: Bordy
Decision: **reference / harvest, not migration**.

Patterns worth stealing:
- One-screen management overview.
- Strong "Today / Needs Attention" area before the full project board.
- Large, clean summary metrics that answer "what needs me?" rather than exposing system plumbing.
- Clickable visual cards leading to detail.
- Relationship-style thinking: customer → contacts → orders → products → contract → emails → stock → literature.
- Calm visual hierarchy with complexity hidden underneath.

## Design direction
The Command Centre landing page should answer, in this order:
1. What needs Andy's attention today?
2. What is moving?
3. What is blocked or waiting?
4. Where is the underlying project/customer detail?
5. What system issue genuinely needs intervention?

The management screen is the front door. AGON_BRAIN, OneDrive, Mintsoft, CRM and other sources remain the authoritative data layers underneath.

## Guardrail
Do not turn every interesting reel into a new install, integration or side project. New tools must earn their place by providing a capability we cannot reasonably harvest into the current stack.
