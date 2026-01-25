import React, { useState, useEffect, useCallback } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import {
  filterExpiredPlannerEvents,
  getTodayDateKey,
  getPlannerSlotLabel,
  PLANNER_START_MINUTES,
  PLANNER_SLOT_DURATION_MINUTES,
  PLANNER_SLOTS_COUNT,
} from '../../utils/dateUtils'
import { PLANNER_EVENTS_KEY, createPlannerEvent } from './plannerUtils'
import SlotList, { SLOT_HEIGHT_PX } from './SlotList'
import EventConstructor from './EventConstructor'
import EventBlock from './EventBlock'
import PlannerHeader from '../atoms/PlannerHeader'
import calendarCheckIcon from '../../icons/Stroked 2px/Calendar Check.svg'
import './DayPlanner.css'

const TOTAL_SLOTS_HEIGHT_PX = SLOT_HEIGHT_PX * PLANNER_SLOTS_COUNT

function DayPlanner() {
  const [rawEvents, setRawEvents] = useLocalStorage(PLANNER_EVENTS_KEY, [])
  const [constructorSlotIndex, setConstructorSlotIndex] = useState(null)

  // On load: remove events older than 12h and persist filtered list
  useEffect(() => {
    const filtered = filterExpiredPlannerEvents(rawEvents)
    if (filtered.length !== rawEvents.length) {
      setRawEvents(filtered)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- run once on mount

  const todayKey = getTodayDateKey()
  const events = filterExpiredPlannerEvents(
    Array.isArray(rawEvents) ? rawEvents : []
  ).filter((e) => e.date === todayKey)

  const setEvents = useCallback(
    (updater) => {
      setRawEvents((prev) => {
        const next = typeof updater === 'function' ? updater(prev || []) : updater
        return filterExpiredPlannerEvents(next)
      })
    },
    [setRawEvents]
  )

  const handleSlotClick = useCallback((slotIndex) => {
    setConstructorSlotIndex(slotIndex)
  }, [])

  const handleCreateEvent = useCallback(
    ({ startMinutes, durationMinutes, title }) => {
      const newEvent = createPlannerEvent({
        date: todayKey,
        startMinutes,
        durationMinutes,
        title,
      })
      setEvents((prev) => [...(prev || []), newEvent])
      setConstructorSlotIndex(null)
    },
    [todayKey, setEvents]
  )

  const handleCancelConstructor = useCallback(() => {
    setConstructorSlotIndex(null)
  }, [])

  const handleDeleteEvent = useCallback(
    (id) => {
      setEvents((prev) => (prev || []).filter((e) => e.id !== id))
    },
    [setEvents]
  )

  const handleResizeEvent = useCallback(
    (id, newDurationMinutes) => {
      setEvents((prev) =>
        (prev || []).map((e) =>
          e.id === id ? { ...e, durationMinutes: newDurationMinutes } : e
        )
      )
    },
    [setEvents]
  )

  const handleMoveEvent = useCallback(
    (id, newStartMinutes) => {
      setEvents((prev) =>
        (prev || []).map((e) =>
          e.id === id ? { ...e, startMinutes: newStartMinutes } : e
        )
      )
    },
    [setEvents]
  )

  const startMinutesForSlot = (slotIndex) =>
    PLANNER_START_MINUTES + slotIndex * PLANNER_SLOT_DURATION_MINUTES

  const now = new Date()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  const isOutsidePlannerRange =
    nowMinutes < PLANNER_START_MINUTES || nowMinutes >= 24 * 60

  return (
    <div className="day-planner">
      <div className="day-planner__header-wrap">
        <PlannerHeader title="На сегодня" iconSrc={calendarCheckIcon} />
      </div>
      {isOutsidePlannerRange && (
        <p className="day-planner__hint text-ttn-400-xs">
          Planner is for 8pm–12am (your time zone).
        </p>
      )}
      <div className="day-planner__body">
        <div className="day-planner__slots-wrap">
          <SlotList onSlotClick={handleSlotClick} />
          {constructorSlotIndex !== null && (
            <EventConstructor
              slotIndex={constructorSlotIndex}
              slotLabel={getPlannerSlotLabel(constructorSlotIndex)}
              startMinutes={startMinutesForSlot(constructorSlotIndex)}
              onSubmit={handleCreateEvent}
              onCancel={handleCancelConstructor}
            />
          )}
        </div>
        <div
          className="day-planner__events-lane"
          style={{ height: TOTAL_SLOTS_HEIGHT_PX }}
        >
          {events.map((event) => (
            <EventBlock
              key={event.id}
              event={event}
              totalHeightPx={TOTAL_SLOTS_HEIGHT_PX}
              onDelete={handleDeleteEvent}
              onResize={handleResizeEvent}
              onMove={handleMoveEvent}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default DayPlanner
