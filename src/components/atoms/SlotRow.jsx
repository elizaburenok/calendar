import React from 'react'
import TimeLabel from './TimeLabel'
import './SlotRow.css'

/**
 * SlotRow – one time slot row: time label + line, clickable.
 * Parent should set --day-planner-slot-height (e.g. 45px) for row height.
 *
 * @param {number} slotIndex - Index of the slot (for onClick)
 * @param {string} label - Time label (e.g. "20:00")
 * @param {boolean} [isCurrent] - Whether this slot is the current time
 * @param {function} [onClick] - Called with (slotIndex) when the row is clicked
 */
function SlotRow({ slotIndex, label, isCurrent = false, onClick }) {
  return (
    <button
      type="button"
      className={`slot-row ${isCurrent ? 'slot-row--current' : ''}`}
      onClick={() => onClick?.(slotIndex)}
      aria-label={`Time slot ${label}`}
    >
      <TimeLabel>{label}</TimeLabel>
    </button>
  )
}

export default SlotRow
