import React from 'react'
import TimeLabel from './TimeLabel'
import './SlotRow.css'

/**
 * SlotRow – one time slot row: time label + line, clickable.
 * Parent can set height via --day-planner-slot-height or via style prop.
 *
 * @param {number} slotIndex - Index of the slot (for onClick)
 * @param {string} label - Time label (e.g. "20:00")
 * @param {boolean} [isCurrent] - Whether this slot is the current time
 * @param {function} [onClick] - Called with (slotIndex) when the row is clicked
 * @param {object} [style] - Optional inline style for the row (e.g. flex, minHeight)
 */
function SlotRow({ slotIndex, label, isCurrent = false, onClick, style }) {
  return (
    <button
      type="button"
      className={`slot-row ${isCurrent ? 'slot-row--current' : ''}`}
      onClick={() => onClick?.(slotIndex)}
      aria-label={`Time slot ${label}`}
      style={style}
    >
      <TimeLabel>{label}</TimeLabel>
    </button>
  )
}

export default SlotRow
