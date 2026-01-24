import React, { useState, useRef, useEffect } from 'react'
import './NoteLink.css'
import penIcon from '../../icons/Stroked 2px/Pen.png'

/**
 * NoteLink Atom Component
 * 
 * A combined interactive element displaying a pencil icon and "Заметка" text.
 * Used as a single reusable atom for note-related actions.
 * Can be clicked to enter edit mode and accept user input.
 *
 * @param {function} onClick - Callback function called when NoteLink is clicked
 * @param {function} onEnter - Callback function called when Enter is pressed while editing (receives saved value)
 * @param {function} onDelete - Callback called when the empty note is deleted via keyboard
 * @param {string} initialValue - Initial value for the note (optional)
 * @param {boolean} autoFocus - If true, automatically enter edit mode when component mounts (for empty notes)
 * @param {function} onEnter - Callback function called when Enter is pressed while editing (receives saved value)
 * @param {string} className - Optional additional CSS classes
 * @param {object} rest - Any additional props to pass to the element
 */
const NoteLink = ({ 
  onClick,
  onEnter,
  onDelete,
  initialValue = '',
  autoFocus = false,
  className = '',
  icon,
  ...rest 
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialValue)
  const inputRef = useRef(null)
  const hasLocalChangesRef = useRef(false)

  // Only sync initialValue on mount, or when it changes from parent (but not if we have local changes)
  useEffect(() => {
    // Only sync if we don't have local changes (user hasn't typed anything)
    if (!hasLocalChangesRef.current) {
      setValue(initialValue)
    }
  }, [initialValue])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  // Auto-focus empty notes when autoFocus prop is true
  useEffect(() => {
    if (autoFocus && !value && !isEditing) {
      setIsEditing(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocus])

  const handleMouseDown = (e) => {
    if (!isEditing) {
      e.preventDefault()
      e.stopPropagation()
      // Set editing state immediately on mousedown to prevent focus outline flash
      setIsEditing(true)
      // Call external onClick if provided (for compatibility)
      if (onClick && e.isTrusted) {
        onClick(e)
      }
    }
  }

  const handleClick = (e) => {
    // If already editing, don't prevent default (let input handle it)
    if (!isEditing) {
      // Prevent default click behavior
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
  }

  const handleChange = (e) => {
    hasLocalChangesRef.current = true
    setValue(e.target.value)
  }

  const handleKeyDown = (e) => {
    // Only handle keys when not editing (input handles its own keys)
    if (!isEditing) {
      const isEmpty = !value || !value.trim()

      // Delete current NoteLink when focused and empty
      if ((e.key === 'Backspace' || e.key === 'Delete') && isEmpty && onDelete) {
        e.preventDefault()
        e.stopPropagation()
        onDelete()
        return
      }

      // Allow keyboard activation when not editing
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        e.stopPropagation()
        setIsEditing(true)
      }
    }
  }

  const handleInputKeyDown = (e) => {
    const isEmpty = !value || !value.trim()

    // Delete current NoteLink when editing and empty
    if ((e.key === 'Backspace' || e.key === 'Delete') && isEmpty && onDelete) {
      e.preventDefault()
      e.stopPropagation()
      setIsEditing(false)
      inputRef.current?.blur()
      onDelete()
      return
    }

    if (e.key === 'Enter') {
      // Save the note and create a new one
      e.preventDefault()
      e.stopPropagation()
      const savedValue = value.trim()
      // Update the value state with the trimmed value
      setValue(savedValue)
      // Keep hasLocalChangesRef as true so useEffect doesn't reset it
      setIsEditing(false)
      inputRef.current?.blur()
      
      // Call onEnter callback with the saved value (always call, even if empty)
      // Parent can decide whether to create a new note based on the value
      if (onEnter) {
        onEnter(savedValue)
      }
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      inputRef.current?.blur()
    }
    // Allow other key events to propagate
  }

  // Extract onClick from rest to avoid conflicts (we handle it separately)
  const { onClick: restOnClick, ...restProps } = rest
  
  return (
    <div
      className={`note-link ${isEditing ? 'note-link--editing' : ''} ${value ? 'note-link--has-value' : ''} ${className}`}
      onMouseDown={!isEditing ? handleMouseDown : undefined}
      onClick={!isEditing ? handleClick : undefined}
      onKeyDown={!isEditing ? handleKeyDown : undefined}
      tabIndex={!isEditing ? 0 : -1}
      role={!isEditing ? 'button' : undefined}
      aria-label="Заметка"
      {...restProps}
    >
      {icon ? (
        icon
      ) : (
        <div 
          className="note-link__icon-wrapper"
          style={{ padding: 'var(--Spacing-1x, 4px) var(--Spacing-2x, 8px) 0 0' }}
        >
          <img 
            className="note-link__icon" 
            src={penIcon}
            width="16"
            height="16"
            alt=""
            aria-hidden="true"
          />
        </div>
      )}
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          className="note-link__input"
          placeholder="Заметка"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleInputKeyDown}
          aria-label="Заметка"
        />
      ) : (
        <span className="note-link__text">
          {value || 'Заметка'}
        </span>
      )}
    </div>
  )
}

export default NoteLink
