import React, { useState, useRef, useEffect } from 'react'
import './DayPlanner.css'

const DURATION_OPTIONS = [15, 30, 60]

/**
 * Inline form to create a new event: name + duration. Submits on Enter or button.
 */
function EventConstructor({ slotIndex, slotLabel, startMinutes, onSubmit, onCancel }) {
  const [title, setTitle] = useState('')
  const [durationMinutes, setDurationMinutes] = useState(30)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e) => {
    e?.preventDefault()
    const trimmed = title.trim()
    onSubmit({
      startMinutes,
      durationMinutes,
      title: trimmed || 'Event',
    })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div
      className="day-planner__event-constructor"
      role="dialog"
      aria-label="New event"
    >
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
        <input
          ref={inputRef}
          type="text"
          className="day-planner__constructor-input"
          placeholder="Event name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Event name"
        />
        <div className="day-planner__constructor-duration">
          <span className="day-planner__constructor-duration-label">Duration</span>
          <select
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            className="day-planner__constructor-select"
            aria-label="Duration in minutes"
          >
            {DURATION_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d} min
              </option>
            ))}
          </select>
        </div>
        <div className="day-planner__constructor-actions">
          <button type="button" className="day-planner__constructor-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="day-planner__constructor-btn day-planner__constructor-btn--primary">
            Add
          </button>
        </div>
      </form>
      <p className="day-planner__constructor-slot-hint">Starts at {slotLabel}</p>
    </div>
  )
}

export default EventConstructor
