import React from 'react'
import { Checkbox, TaskText } from './atoms'
import './TaskItem.css'

/**
 * TaskItem Component
 * 
 * A complete task item component composed of Checkbox and TaskText atoms.
 * Represents a single task in a task list with checkbox and description.
 * 
 * @param {string} text - The task description text
 * @param {boolean} checked - Whether the task is completed (checkbox is checked)
 * @param {boolean} disabled - Whether the task item is disabled
 * @param {function} onToggle - Callback function called when checkbox is toggled (receives new checked state)
 * @param {string} id - Optional unique identifier for the task item
 * @param {string} className - Optional additional CSS classes
 * @param {object} checkboxProps - Additional props to pass to the Checkbox component
 * @param {object} textProps - Additional props to pass to the TaskText component
 */
const TaskItem = ({
  text,
  checked = false,
  disabled = false,
  onToggle,
  id,
  className = '',
  checkboxProps = {},
  textProps = {},
  ...rest
}) => {
  const taskId = id || `task-item-${Math.random().toString(36).substr(2, 9)}`

  const handleToggle = (newChecked) => {
    if (!disabled && onToggle) {
      onToggle(newChecked)
    }
  }

  return (
    <div 
      className={`task-item ${disabled ? 'task-item--disabled' : ''} ${className}`}
      {...rest}
    >
      <div className="task-item__checkbox-wrapper">
        <Checkbox
          checked={checked}
          disabled={disabled}
          onChange={handleToggle}
          id={`${taskId}-checkbox`}
          className="task-item__checkbox"
          {...checkboxProps}
        />
      </div>
      <TaskText
        className="task-item__text"
        {...textProps}
      >
        {text}
      </TaskText>
    </div>
  )
}

export default TaskItem
