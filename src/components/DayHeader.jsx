import React from 'react'
import { DateText, DayOfWeekText, NoteLink } from './atoms'
import './DayHeader.css'

/**
 * DayHeader Component
 * 
 * A complete day header component composed of DateText, DayOfWeekText, and NoteLink atoms.
 * Displays the date, day of week, and note link in a vertical layout.
 * 
 * @param {string|Date} date - The date to display (can be a Date object or formatted string)
 * @param {string} dayOfWeek - The day of week text to display (e.g., "Понедельник")
 * @param {function} onNoteClick - Callback function called when NoteLink is clicked
 * @param {string} noteValue - Optional value for the NoteLink (when integrated with notes list)
 * @param {function} onNoteEnter - Optional callback for Enter key (when integrated with notes list)
 * @param {function} onNoteDelete - Optional callback for Delete key (when integrated with notes list)
 * @param {boolean} noteAutoFocus - Optional auto-focus for NoteLink (when integrated with notes list)
 * @param {string} className - Optional additional CSS classes
 * @param {object} rest - Any additional props to pass to the container element
 */
const DayHeader = ({
  date,
  dayOfWeek,
  onNoteClick,
  noteValue,
  onNoteEnter,
  onNoteDelete,
  noteAutoFocus = false,
  noteMultiline = false,
  className = '',
  ...rest
}) => {
  return (
    <div 
      className={`day-header ${className}`}
      {...rest}
    >
      <div className="day-header__text-wrapper">
        <DateText className="day-header__date">
          {date}
        </DateText>
        <DayOfWeekText className="day-header__day">
          {dayOfWeek}
        </DayOfWeekText>
      </div>
      <div className="day-header__note">
        <NoteLink 
          onClick={onNoteClick}
          initialValue={noteValue}
          onEnter={onNoteEnter}
          onDelete={onNoteDelete}
          autoFocus={noteAutoFocus}
          multiline={noteMultiline}
        />
      </div>
    </div>
  )
}

export default DayHeader
