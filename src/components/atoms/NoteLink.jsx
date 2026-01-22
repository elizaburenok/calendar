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
 * @param {string} className - Optional additional CSS classes
 * @param {object} rest - Any additional props to pass to the element
 */
const NoteLink = ({ 
  onClick,
  className = '',
  ...rest 
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleMouseDown = (e) => {
    if (!isEditing) {
      e.preventDefault()
      e.stopPropagation()
      // Set editing state immediately on mousedown to prevent focus outline flash
      setIsEditing(true)
    }
  }

  const handleClick = (e) => {
    // Prevent default click behavior
    e.preventDefault()
    e.stopPropagation()
  }

  const handleBlur = () => {
    setIsEditing(false)
  }

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (isEditing) {
      if (e.key === 'Escape') {
        setIsEditing(false)
        inputRef.current?.blur()
      }
    } else {
      // Allow keyboard activation when not editing
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        e.stopPropagation()
        setIsEditing(true)
      }
    }
  }

  // Extract onClick from rest to avoid conflicts
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
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          className="note-link__input"
          placeholder="Заметка"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            handleKeyDown(e)
            // Allow input to handle its own key events
          }}
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
