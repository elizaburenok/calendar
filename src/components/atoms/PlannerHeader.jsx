import React from 'react'
import './PlannerHeader.css'

/**
 * PlannerHeader – section header with icon + title.
 * Same layout and structure as the Inbox header: flex row, icon (24×24), then title.
 *
 * @param {string} [title] - Heading text (e.g. "На сегодня")
 * @param {string} [iconSrc] - Image src for the leading icon (optional)
 * @param {string} [iconAlt] - Alt text for the icon (default "")
 * @param {string} [className] - Optional additional CSS class for the wrapper
 */
function PlannerHeader({ title = 'На сегодня', iconSrc, iconAlt = '', className = '' }) {
  return (
    <div className={`planner-header ${className}`.trim()}>
      {iconSrc && (
        <img
          src={iconSrc}
          alt={iconAlt}
          className="planner-header__icon"
          width={24}
          height={24}
        />
      )}
      <h2 className="planner-header__title text-ttn-600-l">{title}</h2>
    </div>
  )
}

export default PlannerHeader
