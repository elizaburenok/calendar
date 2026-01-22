import { createContext, useContext, useState, useCallback } from 'react'

const CalendarContext = createContext(null)

export const useCalendar = () => {
  const context = useContext(CalendarContext)
  if (!context) {
    throw new Error('useCalendar must be used within CalendarProvider')
  }
  return context
}

export const CalendarProvider = ({ children }) => {
  const [tasks, setTasks] = useState([])
  const [activities, setActivities] = useState([])

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

  const value = {
    tasks,
    activities,
    addTask,
    updateTask,
    deleteTask,
    addActivity,
    updateActivity,
    deleteActivity,
  }

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  )
}
