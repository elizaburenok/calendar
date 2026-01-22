import React from 'react'
import './Calendar.css'
import '../../tokens/spacings.css'

const Calendar = () => {
  return (
    <div className="calendar-page">
      <div className="calendar-page__grid">
        {/* First main div - 3 columns */}
        <div className="calendar-page__left-section">
          {/* Active Plan Day */}
          <div className="calendar-page__active-plan-day">
            <h2>Active Plan Day</h2>
            {/* Plans will go here */}
          </div>

          {/* Inbox notes */}
          <div className="calendar-page__inbox-notes">
            <h2>Inbox notes</h2>
            {/* Notes will go here */}
          </div>
        </div>

        {/* Second main div - 9 columns */}
        <div className="calendar-page__right-section">
          <div className="calendar-page__calendar">
            <h2>Calendar</h2>
            <div className="calendar-page__days-grid">
              {/* 6 days in 3x2 grid */}
              {[1, 2, 3, 4, 5, 6].map((day) => (
                <div key={day} className="calendar-page__day">
                  Day {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar
