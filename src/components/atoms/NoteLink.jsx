import React from 'react'
import './NoteLink.css'
import penIcon from '../../icons/Stroked 2px/Pen.png'

/**
 * NoteLink Atom Component
 * 
 * A combined interactive element displaying a pencil icon and "Заметка" text.
 * Used as a single reusable atom for note-related actions.
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
  const handleClick = (e) => {
    if (onClick) {
      onClick(e)
    }
  }

  const handleKeyDown = (e) => {
    // Make it keyboard accessible
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (onClick) {
        onClick(e)
      }
    }
  }

  return (
    <button
      className={`note-link ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      type="button"
      aria-label="Заметка"
      {...rest}
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
      <span className="note-link__text">Заметка</span>
    </button>
  )
}

export default NoteLink
