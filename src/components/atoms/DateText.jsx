import React from 'react'
import './DateText.css'

/**
 * DateText Atom Component
 * 
 * A text component for displaying date labels (e.g., "16 января") with
 * proper typography and styling for dark theme interfaces.
 * 
 * @param {string} children - The date text content to display
 * @param {string} className - Optional additional CSS classes
 * @param {object} rest - Any additional props to pass to the element
 */
const DateText = ({ 
  children,
  className = '',
  ...rest 
}) => {
  const finalClassName = [
    'date-text',
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

export default DateText
