import { createContext, useContext, useState, useCallback } from 'react'

const CalendarContext = createContext(null)

export const useCalendar = () => {
  const context = useContext(CalendarContext)
  if (!context) {
    throw new Error('useCalendar must be used within CalendarProvider')
  }
  return context
}

/** @typedef {{ id: string, title: string, startTime: string, endTime: string, color?: string, isSelected?: boolean }} PlannerEvent */

export const CalendarProvider = ({ children }) => {
  const [tasks, setTasks] = useState([])
  const [activities, setActivities] = useState([])
  const [plannerEvents, setPlannerEvents] = useState([])
  const [selectedEventId, setSelectedEventId] = useState(null)

  const addTask = useCallback((task) => {
    setTasks((prev) => [...prev, { ...task, id: Date.now().toString() }])
  }, [])

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    )
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }, [])

  const addActivity = useCallback((activity) => {
    setActivities((prev) => [
      ...prev,
      { ...activity, id: Date.now().toString() },
    ])
  }, [])

  const updateActivity = useCallback((id, updates) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === id ? { ...activity, ...updates } : activity
      )
    )
  }, [])

  const deleteActivity = useCallback((id) => {
    setActivities((prev) => prev.filter((activity) => activity.id !== id))
  }, [])

  const addPlannerEvent = useCallback((event) => {
    const id = event.id || crypto.randomUUID?.() || Date.now().toString()
    const withDefaults = {
      color: 'purple',
      isSelected: false,
      ...event,
      id,
      startTime: typeof event.startTime === 'string' ? event.startTime : new Date(event.startTime).toISOString(),
      endTime: typeof event.endTime === 'string' ? event.endTime : new Date(event.endTime).toISOString(),
    }
    setPlannerEvents((prev) => [...prev, withDefaults])
    return id
  }, [])

  const updatePlannerEvent = useCallback((id, updates) => {
    setPlannerEvents((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e
        const next = { ...e, ...updates }
        if (updates.startTime != null) next.startTime = typeof updates.startTime === 'string' ? updates.startTime : new Date(updates.startTime).toISOString()
        if (updates.endTime != null) next.endTime = typeof updates.endTime === 'string' ? updates.endTime : new Date(updates.endTime).toISOString()
        return next
      })
    )
  }, [])

  const deletePlannerEvent = useCallback((id) => {
    setPlannerEvents((prev) => prev.filter((e) => e.id !== id))
    setSelectedEventId((current) => (current === id ? null : current))
  }, [])

  const value = {
    tasks,
    activities,
    addTask,
    updateTask,
    deleteTask,
    addActivity,
    updateActivity,
    deleteActivity,
    plannerEvents,
    selectedEventId,
    setSelectedEventId,
    addPlannerEvent,
    updatePlannerEvent,
    deletePlannerEvent,
  }

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  )
}
