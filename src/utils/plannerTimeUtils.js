/**
 * Time ↔ pixel mapping for the day planner widget (visible 4-hour window).
 */

/**
 * Convert a time (minutes from midnight) to vertical position (px) within the visible area.
 * @param {number} minutesFromMidnight
 * @param {number} visibleStartMinutes
 * @param {number} visibleEndMinutes
 * @param {number} totalHeightPx
 * @returns {number} top in px
 */
export function timeToPx(minutesFromMidnight, visibleStartMinutes, visibleEndMinutes, totalHeightPx) {
  const visibleDuration = visibleEndMinutes - visibleStartMinutes
  if (visibleDuration <= 0) return 0
  const fraction = (minutesFromMidnight - visibleStartMinutes) / visibleDuration
  return Math.max(0, Math.min(totalHeightPx, fraction * totalHeightPx))
}

/**
 * Convert vertical position (px) to minutes from midnight.
 * @param {number} px
 * @param {number} visibleStartMinutes
 * @param {number} visibleEndMinutes
 * @param {number} totalHeightPx
 * @returns {number}
 */
export function pxToTime(px, visibleStartMinutes, visibleEndMinutes, totalHeightPx) {
  if (totalHeightPx <= 0) return visibleStartMinutes
  const fraction = px / totalHeightPx
  const visibleDuration = visibleEndMinutes - visibleStartMinutes
  return visibleStartMinutes + fraction * visibleDuration
}

/**
 * Duration in minutes to height in px (within visible window).
 * @param {number} durationMinutes
 * @param {number} visibleStartMinutes
 * @param {number} visibleEndMinutes
 * @param {number} totalHeightPx
 * @returns {number}
 */
export function durationToPx(durationMinutes, visibleStartMinutes, visibleEndMinutes, totalHeightPx) {
  const visibleDuration = visibleEndMinutes - visibleStartMinutes
  if (visibleDuration <= 0) return 0
  return (durationMinutes / visibleDuration) * totalHeightPx
}
