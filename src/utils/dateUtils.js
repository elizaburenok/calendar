/**
 * Date utility functions
 */

/**
 * Get the start of the week (Monday)
 * @param {Date} date - Date to get week start for
 * @returns {Date} Start of the week
 */
export const getWeekStart = (date = new Date()) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  return new Date(d.setDate(diff))
}

/**
 * Get all days of the week
 * @param {Date} weekStart - Start date of the week
 * @returns {Date[]} Array of dates for the week
 */
export const getWeekDays = (weekStart) => {
  const days = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    days.push(date)
  }
  return days
}

/**
 * Format date to string
 * @param {Date} date - Date to format
 * @param {string} format - Format string (default: 'YYYY-MM-DD')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const monthStr = String(month).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  let result = format
    .replace('YYYY', year)
    .replace('MMMM', monthNames[month - 1])
    .replace('MM', monthStr)
    .replace('DD', day)

  return result
}

/**
 * Check if two dates are the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} True if same day
 */
export const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

/**
 * Get day name
 * @param {Date} date - Date to get day name for
 * @param {boolean} short - Return short name (default: false)
 * @returns {string} Day name
 */
export const getDayName = (date, short = false) => {
  const dayNames = short
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return dayNames[date.getDay()]
}

/**
 * Get Russian day name
 * @param {Date} date - Date to get day name for
 * @returns {string} Russian day name (e.g., "Понедельник")
 */
export const getRussianDayName = (date) => {
  const dayNames = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота'
  ]
  return dayNames[date.getDay()]
}

/* ----- Day planner (8pm–12am local time) ----- */

/** Planner day range: 20:00 to 24:00 (midnight), 30-min slots */
export const PLANNER_START_MINUTES = 20 * 60   // 20:00
export const PLANNER_END_MINUTES = 24 * 60     // 24:00
export const PLANNER_SLOT_DURATION_MINUTES = 30
export const PLANNER_SLOTS_COUNT = (PLANNER_END_MINUTES - PLANNER_START_MINUTES) / PLANNER_SLOT_DURATION_MINUTES  // 8

/**
 * Get today's date key (YYYY-MM-DD) in local time
 * @returns {string}
 */
export const getTodayDateKey = () => formatDate(new Date(), 'YYYY-MM-DD')

/**
 * Get the 0-based slot index for a given time (local date).
 * Planner slots: 20:00 = 0, 20:30 = 1, ... 23:30 = 7.
 * @param {Date} date - Local date
 * @returns {number} Slot index 0..PLANNER_SLOTS_COUNT-1, or -1 if outside range
 */
export const getPlannerSlotIndexFromDate = (date) => {
  const minutes = date.getHours() * 60 + date.getMinutes()
  if (minutes < PLANNER_START_MINUTES || minutes >= PLANNER_END_MINUTES) return -1
  return Math.floor((minutes - PLANNER_START_MINUTES) / PLANNER_SLOT_DURATION_MINUTES)
}

/**
 * Get the current planner slot index (for scroll-to-now). If before 20:00 returns 0; if after 24:00 returns last slot.
 * @returns {number} Slot index 0..PLANNER_SLOTS_COUNT-1
 */
export const getCurrentPlannerSlotIndex = () => {
  const now = new Date()
  const minutes = now.getHours() * 60 + now.getMinutes()
  if (minutes < PLANNER_START_MINUTES) return 0
  if (minutes >= PLANNER_END_MINUTES) return PLANNER_SLOTS_COUNT - 1
  return Math.floor((minutes - PLANNER_START_MINUTES) / PLANNER_SLOT_DURATION_MINUTES)
}

/**
 * Get time label for a slot index (e.g. 0 -> "20:00", 1 -> "20:30")
 * @param {number} slotIndex - 0-based slot index
 * @returns {string} "HH:mm"
 */
export const getPlannerSlotLabel = (slotIndex) => {
  const totalMinutes = PLANNER_START_MINUTES + slotIndex * PLANNER_SLOT_DURATION_MINUTES
  const h = Math.floor(totalMinutes / 60) % 24
  const m = totalMinutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/**
 * Filter out planner events older than maxAgeMs (default 12 hours).
 * @param {Array<{ createdAt: string|number }>} events
 * @param {number} [maxAgeMs=12*60*60*1000]
 * @returns {Array} Filtered events
 */
export const filterExpiredPlannerEvents = (events, maxAgeMs = 12 * 60 * 60 * 1000) => {
  if (!Array.isArray(events)) return []
  const cutoff = Date.now() - maxAgeMs
  return events.filter((e) => {
    const created = typeof e.createdAt === 'number' ? e.createdAt : new Date(e.createdAt).getTime()
    return created >= cutoff
  })
}
