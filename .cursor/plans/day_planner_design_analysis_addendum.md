# Addendum: Slot stretch (merge into main plan as Section 3.1)

**Add this section after Section 3 (Conceptual model) and before Section 4 in the Day Planner Design Analysis plan.**

---

## 3.1 Slot stretch when multiple events in one time slot

When **two or more events** are placed in the **same time slot** (same 30-minute band), that slot row must **stretch** so its height is **(n+1) × 45px** (where n = number of events in that slot), so that it encompasses all events.

- **One event in slot** → row height = 1 × 45px = 45px (base).
- **Two events in same slot** → row height = 2 × 45px = 90px (stretch to fit both).
- **n events in same slot** → row height = n × 45px.

So the "space between blocks" for that slot grows vertically to fit multiple stacked events; the time column (and any grid calculations for the event column) must stay in sync with this dynamic height so alignment is preserved. Implementation will need to derive per-slot height from event count (or overlap) and apply it to both the time-axis row and the corresponding event-area band.

---
