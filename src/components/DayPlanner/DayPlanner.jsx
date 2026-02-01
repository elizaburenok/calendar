import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react'
import { useCalendar } from '../../context/CalendarContext'
import PlannerHeader from '../atoms/PlannerHeader'
import {
  getMinutesFromMidnight,
  formatTimeRu,
  todayAtMinutes,
  getTodayDateKey,
  isSameDay,
  WIDGET_SNAP_MINUTES,
  WIDGET_START_MINUTES,
  WIDGET_END_MINUTES,
} from '../../utils/dateUtils'
import WidgetEventBlock from './WidgetEventBlock'
import calendarCheckIcon from '../../icons/Stroked 2px/Calendar Check.svg'
import './DayPlanner.css'

// Figma design: 45px gap between hourly slots (including row height)
const ROW_HEIGHT = 13 // Height of each time row
const ROW_GAP = 45 // Gap between rows
const PX_PER_HOUR = ROW_HEIGHT + ROW_GAP // Total height per hour slot
// Time label takes ~32px, events start after that
const TIME_LABEL_WIDTH = 32

function DayPlanner() {
  const { plannerEvents, addPlannerEvent, updatePlannerEvent, deletePlannerEvent } = useCalendar()
  const [newlyCreatedEventId, setNewlyCreatedEventId] = useState(null)
  const scrollContainerRef = useRef(null)
  
  // Use full day range (08:00 - 22:00) for scrollable view
  const startMinutes = WIDGET_START_MINUTES
  const endMinutes = WIDGET_END_MINUTES
  const totalHours = (endMinutes - startMinutes) / 60
  const totalHeightPx = PX_PER_HOUR * totalHours

  const timeSlots = useMemo(() => {
    const slots = []
    for (let m = startMinutes; m < endMinutes; m += 60) {
      slots.push({ minutes: m, label: formatTimeRu(todayAtMinutes(m)) })
    }
    return slots
  }, [startMinutes, endMinutes])

  // Auto-scroll to current time on mount
  useEffect(() => {
    if (!scrollContainerRef.current) return
    
    const now = new Date()
    const currentMinutes = getMinutesFromMidnight(now)
    
    // Clamp to widget range
    const clampedMinutes = Math.max(startMinutes, Math.min(endMinutes, currentMinutes))
    
    // Calculate scroll position: center current hour in view
    const hourFromStart = (clampedMinutes - startMinutes) / 60
    const scrollTarget = hourFromStart * PX_PER_HOUR
    
    // Scroll so current time is near the top with some padding
    const containerHeight = scrollContainerRef.current.clientHeight
    const scrollPosition = Math.max(0, scrollTarget - containerHeight / 4)
    
    scrollContainerRef.current.scrollTop = scrollPosition
  }, [])

  const todayKey = getTodayDateKey()
  const eventsInRange = useMemo(() => {
    const today = new Date()
    return plannerEvents.filter((event) => {
      const startDate = new Date(event.startTime)
      if (!isSameDay(startDate, today)) return false
      const start = getMinutesFromMidnight(startDate)
      const end = getMinutesFromMidnight(new Date(event.endTime))
      return end > startMinutes && start < endMinutes
    })
  }, [plannerEvents, startMinutes, endMinutes, todayKey])

  const handleSlotClick = useCallback(
    (minutes) => {
      const start = todayAtMinutes(minutes)
      const end = todayAtMinutes(Math.min(minutes + WIDGET_SNAP_MINUTES, 22 * 60))
      const newId = addPlannerEvent({
        title: '',
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      })
      setNewlyCreatedEventId(newId)
    },
    [addPlannerEvent]
  )

  // Clear the newly created flag after the event renders
  const handleEventEditStart = useCallback((eventId) => {
    if (eventId === newlyCreatedEventId) {
      setNewlyCreatedEventId(null)
    }
  }, [newlyCreatedEventId])

  return (
    <div className="day-planner">
      <PlannerHeader title="На сегодня" iconSrc={calendarCheckIcon} className="day-planner__header" />

      <div className="day-planner__scroll-container" ref={scrollContainerRef}>
        <div className="day-planner__content">
          {/* Timeline: time slots as full-width rows with events overlaid */}
          <div className="day-planner__timeline">
            {timeSlots.map(({ minutes, label }, index) => {
              const isCurrent = (() => {
                const now = new Date()
                const currentM = getMinutesFromMidnight(now)
                const hourStart = Math.floor(currentM / 60) * 60
                return minutes === hourStart && currentM >= startMinutes && currentM < endMinutes
              })()
              return (
                <button
                  key={minutes}
                  type="button"
                  className={`day-planner__time-row ${isCurrent ? 'day-planner__time-row--current' : ''}`}
                  onClick={() => handleSlotClick(minutes)}
                  aria-label={`Добавить событие в ${label}`}
                >
                  <span className="day-planner__time-label">{label}</span>
                  <span className="day-planner__time-line" aria-hidden="true" />
                </button>
              )
            })}
          </div>

          {/* Events layer: absolutely positioned over the timeline */}
          <div className="day-planner__events" aria-label="События">
            {eventsInRange.map((event) => (
              <WidgetEventBlock
                key={event.id}
                event={event}
                visibleStartMinutes={startMinutes}
                visibleEndMinutes={endMinutes}
                totalHeightPx={totalHeightPx}
                pxPerHour={PX_PER_HOUR}
                timeLabelWidth={TIME_LABEL_WIDTH}
                onDelete={deletePlannerEvent}
                onUpdate={updatePlannerEvent}
                autoFocus={event.id === newlyCreatedEventId}
                onEditStart={handleEventEditStart}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DayPlanner
