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

  const [localTasks, setLocalTasks] = useState(() => {
    // Start with provided tasks
    return tasks.length > 0 ? [...tasks] : []
  })
  const taskRefs = useRef([])
  const [focusTaskIndex, setFocusTaskIndex] = useState(null)

  // Sync tasks from props if they change and we haven't initialized local state properly
  useEffect(() => {
    if (tasks.length > 0 && localTasks.length === 0) {
      setLocalTasks(tasks)
    }
  }, [tasks])

  // Helper: focus existing input or enter edit mode on TaskItem
  const focusOrEnterEditTask = (taskElement) => {
    if (!taskElement) return

    const existingInput = taskElement.querySelector('input[type="text"]')
    if (existingInput) {
      existingInput.focus()
      return
    }

    const taskTextElement = taskElement.querySelector('.task-item__text')
    if (taskTextElement) {
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
      taskTextElement.dispatchEvent(clickEvent)

      // After TaskItem enters edit mode, focus the newly created input
      setTimeout(() => {
        const newInput = taskElement.querySelector('input[type="text"]')
        if (newInput) {
          newInput.focus()
        }
      }, 0)
    }
  }

  // Manage focus behaviour for tasks
  useEffect(() => {
    if (localTasks.length === 0) return

    if (focusTaskIndex !== null) {
      const targetIndex = Math.max(0, Math.min(focusTaskIndex, localTasks.length - 1))
      setTimeout(() => {
        const taskElement = taskRefs.current[targetIndex]
        focusOrEnterEditTask(taskElement)
      }, 0)
      
      setFocusTaskIndex(null)
      return
    }

    // Auto-focus the last empty task (assuming new task)
    // Disabled to prevent auto-focusing on initial render with placeholder tasks
    /*
    const lastIndex = localTasks.length - 1
    if (localTasks[lastIndex] && !localTasks[lastIndex].text && lastIndex >= 0) {
      setTimeout(() => {
        const taskElement = taskRefs.current[lastIndex]
        focusOrEnterEditTask(taskElement)
      }, 0)
    }
    */
  }, [localTasks, focusTaskIndex])

  const handleTaskUpdate = (savedValue, taskIndex) => {
    setLocalTasks((prevTasks) => {
      // If the saved value is empty, remove the task
      if (!savedValue.trim()) {
        const newTasks = prevTasks.filter((_, index) => index !== taskIndex)
        return newTasks
      }

      const newTasks = [...prevTasks]
      // Update the current task with saved value
      if (newTasks[taskIndex]) {
        newTasks[taskIndex] = { ...newTasks[taskIndex], text: savedValue }
      }
      return newTasks
    })
  }

  const handleContainerClick = (e) => {
    // Check if the click is on an interactive element or existing task
    if (
      e.target.closest('.day-agenda__header') ||
      e.target.closest('.day-agenda__notes-list') ||
      e.target.closest('.day-agenda__task-item') ||
      e.target.closest('input') ||
      e.target.closest('button') ||
      e.target.closest('a')
    ) {
      return
    }

    setLocalTasks((prevTasks) => {
      const lastTask = prevTasks[prevTasks.length - 1]
      
      // If last task exists and is empty, don't add another one, just focus it
      if (lastTask && !lastTask.text) {
        setTimeout(() => setFocusTaskIndex(prevTasks.length - 1), 0)
        return prevTasks
      }
      
      const newTask = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: '',
        checked: false
      }
      
      // Focus the new task
      setTimeout(() => setFocusTaskIndex(prevTasks.length), 0)
      
      return [...prevTasks, newTask]
    })
  }

  const handleTaskEnter = (savedValue, taskIndex) => {
    setLocalTasks((prevTasks) => {
      const newTasks = [...prevTasks]
      // Update the current task with saved value
      if (newTasks[taskIndex]) {
        newTasks[taskIndex] = { ...newTasks[taskIndex], text: savedValue }
      }
      
      // Create new task
      const newTask = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: '',
        checked: false
      }

      // Insert new task immediately after the current one
      newTasks.splice(taskIndex + 1, 0, newTask)
      
      return newTasks
    })

    // Focus the newly created task
    setFocusTaskIndex(taskIndex + 1)
  }

  const handleTaskDelete = (taskIndex) => {
    setLocalTasks((prevTasks) => {
      const newTasks = prevTasks.filter((_, index) => index !== taskIndex)
      return newTasks
    })

    setFocusTaskIndex(Math.max(taskIndex - 1, 0))
  }

  const handleLocalTaskToggle = (taskId, newChecked) => {
    setLocalTasks((prevTasks) => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, checked: newChecked } : task
      )
    )
    
    if (onTaskToggle) {
      onTaskToggle(taskId, newChecked)
    }
  }

  return (
    <div 
      className={`day-agenda ${className}`}
      onClick={handleContainerClick}
      {...rest}
    >
      <DayHeader
        date={date}
        dayOfWeek={dayOfWeek}
        onNoteClick={handleHeaderNoteClick}
        noteValue={notes.length > 0 ? notes[0] : ''}
        onNoteEnter={notes.length > 0 ? handleFirstNoteEnter : undefined}
        onNoteDelete={notes.length > 0 ? handleFirstNoteDelete : undefined}
        noteAutoFocus={false}
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
      
      <div className="day-agenda__tasks-list">
        {localTasks.map((task, index) => (
          <div 
            key={task.id}
            ref={(el) => { taskRefs.current[index] = el }}
            className="day-agenda__task-item"
          >
            <TaskItem
              id={task.id}
              text={task.text}
              checked={task.checked || false}
              disabled={task.disabled || false}
              onToggle={(newChecked) => handleLocalTaskToggle(task.id, newChecked)}
              onSave={(savedValue) => handleTaskUpdate(savedValue, index)}
              onEnter={(savedValue) => handleTaskEnter(savedValue, index)}
              onDelete={() => handleTaskDelete(index)}
              autoFocus={false}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default DayAgenda
