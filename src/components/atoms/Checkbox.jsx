import React from 'react'
import './Checkbox.css'

/**
 * Checkbox Atom Component
 * 
 * A circular checkbox component with checked, unchecked, and disabled states.
 * 
 * @param {boolean} checked - Whether the checkbox is checked
 * @param {boolean} disabled - Whether the checkbox is disabled
 * @param {function} onChange - Callback function called when checkbox state changes
 * @param {string} id - Optional unique identifier for the checkbox
 * @param {string} className - Optional additional CSS classes
 * @param {object} rest - Any additional props to pass to the input element
 */
const Checkbox = ({ 
  checked = false, 
  disabled = false, 
  onChange, 
  id,
  className = '',
  ...rest 
}) => {
  const handleChange = (e) => {
    if (!disabled && onChange) {
      onChange(e.target.checked)
    }
  }

  return (
    <label 
      className={`checkbox-wrapper ${className} ${disabled ? 'checkbox-wrapper--disabled' : ''}`}
      htmlFor={id}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className="checkbox-input"
        {...rest}
      />
      <span className={`checkbox-indicator ${checked ? 'checkbox-indicator--checked' : ''} ${disabled ? 'checkbox-indicator--disabled' : ''}`}>
        {checked && (
          <svg 
            className="checkbox-checkmark" 
            width="10" 
            height="8" 
            viewBox="0 0 10 8" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M1 4L3.5 6.5L9 1" 
              stroke="white" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </label>
  )
}

export default Checkbox
