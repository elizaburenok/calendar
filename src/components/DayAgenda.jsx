import React, { useState, useEffect, useRef } from 'react'
import DayHeader from './DayHeader'
import TaskItem from './TaskItem'
import { NoteLink } from './atoms'
import './DayAgenda.css'

/**
 * DayAgenda Component
 * 
 * A complete day agenda component that displays a day header (date, day of week, note link)
 * and a list of tasks for that day. This is the full component from the Figma design.
 * 
 * @param {string|Date} date - The date to display (can be a Date object or formatted string)
 * @param {string} dayOfWeek - The day of week text to display (e.g., "Понедельник")
 * @param {Array} tasks - Array of task objects with shape: { id, text, checked, disabled?, onToggle? }
 * @param {function} onNoteClick - Callback function called when NoteLink is clicked
 * @param {function} onTaskToggle - Optional callback function called when any task is toggled (receives taskId and new checked state)
 * @param {string} className - Optional additional CSS classes
 * @param {object} rest - Any additional props to pass to the container element
 */
const DayAgenda = ({
  date,
  dayOfWeek,
  tasks = [],
  onNoteClick,
  onTaskToggle,
  className = '',
  ...rest
}) => {
  // Local notes state for this day (uses NoteLink keyboard logic: Enter to add, Delete to remove)
  const [notes, setNotes] = useState([''])
  const noteRefs = useRef([])
  const [focusNoteIndex, setFocusNoteIndex] = useState(null)

  // Helper: focus existing input or programmatically enter edit mode on NoteLink
  const focusOrEnterEdit = (noteElement) => {
    if (!noteElement) return

    const existingInput = noteElement.querySelector('input')
    if (existingInput) {
      existingInput.focus()
      return
    }

    const noteLinkElement = noteElement.querySelector('.note-link')
    if (noteLinkElement) {
      const mouseDownEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true
      })
      noteLinkElement.dispatchEvent(mouseDownEvent)

      // After NoteLink enters edit mode, focus the newly created input
      setTimeout(() => {
        const newInput = noteElement.querySelector('input')
        if (newInput) {
          newInput.focus()
        }
      }, 0)
    }
  }

  // Manage focus behaviour for notes:
  // 1) If focusNoteIndex is set (e.g. after delete), focus that note
  // 2) Otherwise, auto-focus the last empty note when a new one is created
  useEffect(() => {
    if (notes.length === 0) return

    if (focusNoteIndex !== null) {
      const targetIndex = Math.max(0, Math.min(focusNoteIndex, notes.length - 1))
      
      // If target is index 0, it's in DayHeader - focus it via DOM query
      if (targetIndex === 0) {
        setTimeout(() => {
          const headerNoteLink = document.querySelector('.day-agenda__header .note-link')
          if (headerNoteLink) {
            const input = headerNoteLink.querySelector('input')
            if (input) {
              input.focus()
            } else {
              // Trigger edit mode
              const mouseDownEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true
              })
              headerNoteLink.dispatchEvent(mouseDownEvent)
              setTimeout(() => {
                const newInput = headerNoteLink.querySelector('input')
                if (newInput) {
                  newInput.focus()
                }
              }, 0)
            }
          }
        }, 0)
      } else {
        // Target is in the notes list
        const noteElement = noteRefs.current[targetIndex]
        focusOrEnterEdit(noteElement)
      }
      
      setFocusNoteIndex(null)
      return
    }

    // Auto-focus the last empty note when a new one is created
    const lastIndex = notes.length - 1
    if (notes[lastIndex] === '' && lastIndex > 0) {
      // Last note is in the list (not DayHeader)
      setTimeout(() => {
        const noteElement = noteRefs.current[lastIndex]
        focusOrEnterEdit(noteElement)
      }, 0)
    } else if (notes.length === 1 && notes[0] === '') {
      // Only one note (in DayHeader) and it's empty
      setTimeout(() => {
        const headerNoteLink = document.querySelector('.day-agenda__header .note-link')
        if (headerNoteLink) {
          const input = headerNoteLink.querySelector('input')
          if (input) {
            input.focus()
          } else {
            const mouseDownEvent = new MouseEvent('mousedown', {
              bubbles: true,
              cancelable: true
            })
            headerNoteLink.dispatchEvent(mouseDownEvent)
            setTimeout(() => {
              const newInput = headerNoteLink.querySelector('input')
              if (newInput) {
                newInput.focus()
              }
            }, 0)
          }
        }
      }, 0)
    }
  }, [notes, focusNoteIndex])

  const handleNoteEnter = (savedValue, noteIndex) => {
    setNotes((prevNotes) => {
      const newNotes = [...prevNotes]
      // Update the current note with saved value (even if empty)
      newNotes[noteIndex] = savedValue
      // Always add a new empty note at the end when Enter is pressed
      newNotes.push('')
      return newNotes
    })
  }

  const handleNoteDelete = (noteIndex) => {
    setNotes((prevNotes) => {
      const newNotes = prevNotes.filter((_, index) => index !== noteIndex)
      return newNotes.length > 0 ? newNotes : ['']
    })

    setFocusNoteIndex(Math.max(noteIndex - 1, 0))
  }

  // Handler for the first note (in DayHeader) - index 0
  const handleFirstNoteEnter = (savedValue) => {
    handleNoteEnter(savedValue, 0)
  }

  const handleFirstNoteDelete = () => {
    handleNoteDelete(0)
  }

  // When user clicks the NoteLink in the DayHeader (when not in edit mode),
  // it will be handled by NoteLink's own onClick, but we can still call external callback
  const handleHeaderNoteClick = () => {
    if (onNoteClick) {
      onNoteClick()
    }
  }

  const handleTaskToggle = (taskId, newChecked) => {
    if (onTaskToggle) {
      onTaskToggle(taskId, newChecked)
    }
  }

  return (
    <div 
      className={`day-agenda ${className}`}
      {...rest}
    >
      <DayHeader
        date={date}
        dayOfWeek={dayOfWeek}
        onNoteClick={handleHeaderNoteClick}
        noteValue={notes.length > 0 ? notes[0] : ''}
        onNoteEnter={notes.length > 0 ? handleFirstNoteEnter : undefined}
        onNoteDelete={notes.length > 0 ? handleFirstNoteDelete : undefined}
        noteAutoFocus={notes.length > 0 && notes[0] === '' && notes.length === 1 && focusNoteIndex === null}
        className="day-agenda__header"
      />

      {notes.length > 1 && (
        <div className="day-agenda__notes-list">
          {notes.slice(1).map((note, index) => {
            const actualIndex = index + 1 // +1 because index 0 is in DayHeader
            return (
              <div
                key={actualIndex}
                ref={(el) => { noteRefs.current[actualIndex] = el }}
                className="day-agenda__note-wrapper"
              >
                <NoteLink
                  initialValue={note}
                  autoFocus={note === '' && actualIndex === notes.length - 1}
                  onEnter={(savedValue) => handleNoteEnter(savedValue, actualIndex)}
                  onDelete={() => handleNoteDelete(actualIndex)}
                />
              </div>
            )
          })}
        </div>
      )}
      
      {tasks.length > 0 && (
        <div className="day-agenda__tasks-list">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              text={task.text}
              checked={task.checked || false}
              disabled={task.disabled || false}
              onToggle={(newChecked) => handleTaskToggle(task.id, newChecked)}
              className="day-agenda__task-item"
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default DayAgenda
