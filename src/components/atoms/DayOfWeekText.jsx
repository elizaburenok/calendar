import React from 'react'
import './DayOfWeekText.css'

/**
 * DayOfWeekText Atom Component
 * 
 * A text component for displaying day of week labels (e.g., "Понедельник") with
 * proper typography and styling for dark theme interfaces.
 * 
 * @param {string} children - The day of week text content to display
 * @param {string} className - Optional additional CSS classes
 * @param {object} rest - Any additional props to pass to the element
 */
const DayOfWeekText = ({ 
  children,
  className = '',
  ...rest 
}) => {
  const finalClassName = [
    'day-of-week-text',
    className
  ].filter(Boolean).join(' ')

  return (
    <span 
      className={finalClassName}
      {...rest}
    >
      {children}
    </span>
  )
}

export default DayOfWeekText
