import React, { useState, useRef, useEffect } from 'react'
import { Checkbox, TaskText } from './atoms'
import './TaskItem.css'

/**
 * TaskItem Component
 * 
 * A complete task item component composed of Checkbox and TaskText atoms.
 * Represents a single task in a task list with checkbox and description.
 * Now supports editing mode similar to NoteLink.
 * 
 * @param {string} text - The task description text
 * @param {boolean} checked - Whether the task is completed (checkbox is checked)
 * @param {boolean} disabled - Whether the task item is disabled
 * @param {function} onToggle - Callback function called when checkbox is toggled (receives new checked state)
 * @param {function} onEnter - Callback function called when Enter is pressed while editing (receives saved value)
 * @param {function} onDelete - Callback called when the empty task is deleted via keyboard
 * @param {boolean} autoFocus - If true, automatically enter edit mode when component mounts (for empty tasks)
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
  onEnter,
  onDelete,
  autoFocus = false,
  id,
  className = '',
  checkboxProps = {},
  textProps = {},
  ...rest
}) => {
  const taskId = id || `task-item-${Math.random().toString(36).substr(2, 9)}`
  
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(text || '')
  const inputRef = useRef(null)
  const hasLocalChangesRef = useRef(false)

  // Only sync text prop on mount, or when it changes from parent (but not if we have local changes)
  useEffect(() => {
    // Only sync if we don't have local changes (user hasn't typed anything)
    if (!hasLocalChangesRef.current) {
      setValue(text || '')
    }
  }, [text])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  // Auto-focus empty tasks when autoFocus prop is true
  useEffect(() => {
    if (autoFocus && !value && !isEditing) {
      setIsEditing(true)
    }
  }, [autoFocus, value, isEditing])

  const handleToggle = (newChecked) => {
    if (!disabled && onToggle) {
      onToggle(newChecked)
    }
  }

  const handleTextClick = (e) => {
    if (!disabled && !isEditing) {
      e.preventDefault()
      e.stopPropagation()
      setIsEditing(true)
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
    // Save on blur if changed? For now just exit edit mode
    if (onEnter && value !== text) {
        onEnter(value)
    }
  }

  const handleChange = (e) => {
    hasLocalChangesRef.current = true
    setValue(e.target.value)
  }

  const handleInputKeyDown = (e) => {
    const isEmpty = !value || !value.trim()

    // Delete current task when editing and empty
    if ((e.key === 'Backspace' || e.key === 'Delete') && isEmpty && onDelete) {
      e.preventDefault()
      e.stopPropagation()
      setIsEditing(false)
      inputRef.current?.blur()
      onDelete()
      return
    }

    if (e.key === 'Enter') {
      // Save the task and create a new one
      e.preventDefault()
      e.stopPropagation()
      const savedValue = value.trim()
      // Update the value state with the trimmed value
      setValue(savedValue)
      // Keep hasLocalChangesRef as true so useEffect doesn't reset it
      setIsEditing(false)
      inputRef.current?.blur()
      
      // Call onEnter callback with the saved value
      if (onEnter) {
        onEnter(savedValue)
      }
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setValue(text || '') // Revert to original text
      inputRef.current?.blur()
    }
    // Allow other key events to propagate
  }

  return (
    <div 
      className={`task-item ${disabled ? 'task-item--disabled' : ''} ${isEditing ? 'task-item--editing' : ''} ${className}`}
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
      
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          className="task-item__input"
          placeholder="New task"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleInputKeyDown}
          disabled={disabled}
        />
      ) : (
        <TaskText
          className="task-item__text"
          onClick={handleTextClick}
          {...textProps}
        >
          {value || text}
        </TaskText>
      )}
    </div>
  )
}

export default TaskItem
