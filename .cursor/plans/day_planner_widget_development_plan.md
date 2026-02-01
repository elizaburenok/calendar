# Day Planner Widget — Development Plan

Based on the technical requirements for the “For today” widget in the calendar page (blank white div).

---

## 1. Overall structure

| Requirement | Implementation |
|-------------|----------------|
| Vertical timeline, fixed range **08:00–22:00** | Time scale component + constants in `dateUtils` (e.g. `WIDGET_START_HOUR`, `WIDGET_END_HOUR`). |
| **Header**: calendar icon + title “For today” + widget name “Widget” (top left) | `DayPlannerHeader` (or header section in `DayPlanner`) using existing Calendar Check icon. |
| **Main area**: list of hourly time slots, labels 08:00, 09:00, … | Time scale column (labels) + scrollable events column; slots can be hourly with optional sub-grid (15/30 min). |

**Components/layers (per requirements):**

- **Time scale** — 08:00–22:00 labels, aligned with event column.
- **Scrollable container** — holds event blocks; only the “visible 4 hours” portion is in view (or virtualized).
- **Time ↔ pixel mapping** — single source of truth: `minutesFromStart` ↔ `px` using “height per hour” (e.g. `pxPerHour`).

---

## 2. Time logic and visibility

| Requirement | Implementation |
|-------------|----------------|
| **Today** = system date; no date navigation for now | Use `new Date()` for “today”; no prev/next day UI. |
| Show **nearest 4 hours** from current time; timeline shifts so visible window = upcoming 4 hours | Compute `visibleStart`, `visibleEnd` (in minutes from midnight or from 08:00). E.g. at 09:15 → show ~09:00–13:00. Round start down (by hour or 30 min, TBD). |
| Slots 08:00–22:00 always exist logically | Full day range in state/calculations; only **render** the visible 4-hour slice. |
| If “next 4 hours” goes past 22:00, clamp at 22:00 | `visibleEnd = Math.min(visibleEnd, 22*60)`. |
| **Granularity** 15 or 30 min for snapping | One constant, e.g. `SNAP_MINUTES = 15` (or 30); all resize/move/create snap to this. |

**Rounding rule (to agree):** e.g. “visible window start = current hour, floored” (09:15 → 09:00) or “nearest 30 min”. Plan: start with **hour** for visible window; snap grid 15 or 30 min.

---

## 3. Event data and state

| Requirement | Implementation |
|-------------|----------------|
| **id** (unique) | string, e.g. `crypto.randomUUID()` or `Date.now().toString()`. |
| **title** (string) | Plain string. |
| **startTime**, **endTime** | Stored as **Date** or **ISO string** (same day); in code use Date for calculations, persist as ISO. |
| **color / theme** | e.g. `color: 'purple'` or `theme: 'default'`; CSS variable or class for main purple + variations. |
| **isSelected** | Boolean for interaction state (selection ring, context menu, etc.). |

**Storage:** Context (e.g. extend `CalendarContext` or dedicated `DayPlannerContext`) with `events`, `addEvent`, `updateEvent`, `deleteEvent`. Optional: sync to `localStorage` for persistence.

---

## 4. Event rendering

| Requirement | Implementation |
|-------------|----------------|
| Block from **startTime** to **endTime** | Position: `top = (start - visibleStart) / visibleDuration * 100%` (or px). Height: `(end - start) / visibleDuration * containerHeight` (or px). |
| **Title** top-left, 1–2 lines, ellipsis | CSS `display: -webkit-box; -webkit-line-clamp: 2; overflow: hidden; text-overflow: ellipsis`. |
| **Background** purple, rounded corners, light shadow | Use design tokens / Figma when available; fallback: `--primitive-brand` + border-radius + box-shadow. |
| **Overlapping** | V1: no overlapping (validation on create/update). Later: multi-column layout for overlapping events (to be agreed). |

**Time ↔ pixel:** One helper, e.g. `timeToPx(date, visibleStartMinutes, visibleEndMinutes, totalHeightPx)` and `pxToTime(px, …)` returning Date or minutes.

---

## 5. Event interactions

### 5.1 Creating events

| Option | Implementation |
|--------|----------------|
| **A** — Click empty slot → form (title + start/end) | On slot click (or empty area click), open modal/drawer with form; times default to clicked slot; validate within 08:00–22:00 and no overlap (V1). |
| **B** — Drag to create block, then enter title | Mousedown on empty area → drag → create draft event with start/end from drag; on mouseup open inline form or modal for title; on save add to state. |

**Plan:** Implement **Option A** first (simpler); add Option B later if needed. Save: store as `{ id, title, startTime, endTime, color, isSelected }` with Date/ISO.

### 5.2 Moving events (drag & drop)

- Drag event vertically; **snap** to grid (15 or 30 min).
- **Bounds:** 08:00–22:00; event cannot go outside (clamp `startTime` so `endTime <= 22:00` and `startTime >= 08:00`).
- Reuse/adapt existing `EventBlock` move logic (e.g. from atoms); use new time range and snap step.

### 5.3 Resizing events

- **Top edge** → change `startTime` only; **bottom edge** → change `endTime` only.
- Snap to same grid (15/30 min).
- **Min height** = one snap step (e.g. 15 min) so block stays interactable.
- **Bounds:** start/end within 08:00–22:00; `endTime > startTime`.

### 5.4 Deleting events

- Trigger: **close icon** on event, or **right-click / context menu** (exact UX TBD).
- **Optional:** confirmation dialog before delete.
- Remove from state and run delete animation (see below).

---

## 6. States and animations

| Requirement | Implementation |
|-------------|----------------|
| **Hover/active** | Subtle shadow or brightness change (CSS). |
| **Drag/resize start** | Brighter border or class `event-block--dragging`. |
| **Position/size changes** | CSS transitions ~150–250 ms, ease-in-out (e.g. `transition: top 0.2s ease-out, height 0.2s ease-out`). |
| **Create** | Fade-in or short slide-in (e.g. `@keyframes` + class). |
| **Delete** | Fade/scale out, then remove from DOM (`onAnimationEnd` or timeout). |
| **Time progression** | As current time moves (e.g. every minute), optionally **smoothly shift** the 4-hour window (scroll/translate) instead of sudden jump; can use `requestAnimationFrame` or interval. |

---

## 7. Technical notes

| Topic | Approach |
|-------|----------|
| **Time zone / locale** | V1: user’s local time only; formatting `ru-RU` (e.g. `toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })`). Extensible later (e.g. pass locale/timezone). |
| **Time values** | Store **Date** or **ISO strings** (same day); avoid “raw hour numbers” so multi-day or other views are easy later. |
| **Structure** | Separate: (1) Time scale, (2) Scrollable events container, (3) Time↔pixel helpers in `dateUtils` or a small `plannerTimeUtils.js`. |

---

## 8. Implementation order (phased)

1. **Phase 1 — Structure & data**
   - Add `dateUtils` for 08:00–22:00, visible 4-hour window, snap step (15 or 30 min).
   - Add events to context (or DayPlannerContext): model + CRUD.
   - DayPlanner: header (icon + “For today” + “Widget”), time scale column, scrollable area with fixed “height per hour”.

2. **Phase 2 — Rendering**
   - Time-to-pixel (and pixel-to-time) helpers.
   - Render event blocks (position + height from start/end); title, purple style, rounded corners, shadow (align with Figma when provided).
   - Only show events in visible 4-hour range.

3. **Phase 3 — Interactions**
   - Create: click empty slot → form (title + start/end); validate bounds and no overlap.
   - Move: drag with snap; clamp to 08:00–22:00.
   - Resize: top/bottom handles, snap, min height one step.
   - Delete: icon or context menu; optional confirm; animate out.

4. **Phase 4 — Polish**
   - Animations (create fade-in, delete fade-out, smooth position/height transitions).
   - Optional: smooth shift of visible window as time advances.
   - Optional: drag-to-create (Option B).

5. **Later**
   - Overlapping events layout (if agreed).
   - Multi-day or date navigation (if required).

---

## 9. File / component map (suggested)

- **`src/utils/dateUtils.js`** — Add: `WIDGET_START_MINUTES`, `WIDGET_END_MINUTES`, `SNAP_MINUTES`, `getVisibleWindowMinutes()`, `snapToGrid(minutes)`, `formatTimeRu(date)`.
- **`src/utils/plannerTimeUtils.js`** (optional) — `timeToPx`, `pxToTime` for visible window + total height.
- **`src/context/CalendarContext.jsx`** (or new `DayPlannerContext.jsx`) — `events`, `addEvent`, `updateEvent`, `deleteEvent`, `setSelectedEventId`.
- **`src/components/DayPlanner/DayPlanner.jsx`** — Container: header + time scale + events column.
- **`src/components/DayPlanner/DayPlannerHeader.jsx`** — Icon + “For today” + “Widget”.
- **`src/components/DayPlanner/DayPlannerTimeScale.jsx`** — Renders labels for visible 4 hours (e.g. one row per hour or per 30 min).
- **`src/components/DayPlanner/DayPlannerEventsLane.jsx`** — Scrollable area; maps events to blocks; handles click-for-create.
- **`src/components/DayPlanner/EventBlock.jsx`** (or reuse/adapt atoms/EventBlock) — Single event: title, resize handles (top/bottom), move, delete; uses Date/ISO and new time range.

When the Figma design is available, apply exact spacing, typography, shadows, and colors to these components.
