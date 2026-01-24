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
