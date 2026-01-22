import React from 'react'
import './TaskText.css'

/**
 * TaskText Atom Component
 * 
 * A text component for displaying task descriptions with proper typography
 * and styling for dark theme interfaces.
 * 
 * @param {string} children - The text content to display
 * @param {string} variant - Typography variant ('m', 's', 'l', etc.) - defaults to 'm'
 * @param {string} weight - Font weight ('400', '500', '600') - defaults to '400'
 * @param {string} color - Color variant ('primary', 'secondary') - defaults to 'secondary' for light grey on dark background
 * @param {string} className - Optional additional CSS classes
 * @param {object} rest - Any additional props to pass to the element
 */
const TaskText = ({ 
  children,
  variant = 'm',
  weight = '400',
  color = 'secondary',
  className = '',
  ...rest 
}) => {
  // Build typography class based on props
  const typographyClass = `text-ttn-${weight}-${variant}`
  
  // Use color override for light text on dark background
  const colorOverride = color === 'primary' 
    ? 'task-text--primary-on-inverse' 
    : 'task-text--secondary-on-inverse'

  const finalClassName = [
    'task-text',
    typographyClass,
    colorOverride,
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

export default TaskText
