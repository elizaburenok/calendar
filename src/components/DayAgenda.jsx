import React from 'react'
import DayHeader from './DayHeader'
import TaskItem from './TaskItem'
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
        onNoteClick={onNoteClick}
        className="day-agenda__header"
      />
      
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
