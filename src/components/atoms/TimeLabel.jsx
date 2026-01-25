import React from 'react'
import './TimeLabel.css'

/**
 * TimeLabel – time display + horizontal line for the planner timeline (e.g. "08:00").
 * Matches Figma: time text (12px, medium) plus a thin horizontal line to the right.
 * Color inherits from parent so the line matches the text (e.g. light grey on dark).
 *
 * @param {string} [children] - Time string to display (e.g. getPlannerSlotLabel(i))
 * @param {string} [className] - Optional additional CSS class on the text
 */
function TimeLabel({ children, className = '' }) {
  return (
    <span className="time-label-row">
      <span className={`time-label text-ttn-500-xs ${className}`.trim()}>
        {children}
      </span>
      <span className="time-label__line" aria-hidden="true" />
    </span>
  )
}

export default TimeLabel
