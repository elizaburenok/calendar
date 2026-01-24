import React, { useMemo } from 'react'
import './Calendar.css'
import '../../tokens/spacings.css'
import DayAgenda from '../../components/DayAgenda'
import InboxNotes from '../../components/InboxNotes/InboxNotes'
import { getWeekStart, formatDate, getRussianDayName } from '../../utils/dateUtils'

const Calendar = () => {
  // Generate 6 days starting from Monday of current week
  const days = useMemo(() => {
    const weekStart = getWeekStart(new Date())
    const daysArray = []
    
    // Generate 6 days: Monday through Saturday
    for (let i = 0; i < 6; i++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      
      // Add some test tasks for the first day to verify TaskItem rendering
      const testTasks = i === 0 ? [
        { id: `task-${i}-1`, text: 'Тестовая задача 1', checked: false },
        { id: `task-${i}-2`, text: 'Тестовая задача 2', checked: true }
      ] : []
      
      daysArray.push({
        id: `day-${i}`,
        date: formatDate(date, 'YYYY-MM-DD'),
        dayOfWeek: getRussianDayName(date),
        dateObj: date,
        tasks: testTasks
      })
    }
    
    return daysArray
  }, [])
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
            <InboxNotes />
          </div>
        </div>

        {/* Second main div - 9 columns */}
        <div className="calendar-page__right-section">
          <div className="calendar-page__calendar">
            <div className="calendar-page__days-grid">
              {/* 6 days in 3x2 grid, each with DayAgenda */}
              {days.map((day) => (
                <DayAgenda
                  key={day.id}
                  className="calendar-page__day"
                  date={day.date}
                  dayOfWeek={day.dayOfWeek}
                  tasks={day.tasks}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar
