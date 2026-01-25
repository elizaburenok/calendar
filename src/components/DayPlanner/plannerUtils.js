/**
 * Planner event helpers and constants.
 * Event shape: { id, date (YYYY-MM-DD), startMinutes, durationMinutes, title, createdAt }
 */

export const PLANNER_EVENTS_KEY = 'calendar-planner-events'

/**
 * Create a new planner event (assigns id and createdAt).
 * @param {object} params
 * @param {string} params.date - YYYY-MM-DD
 * @param {number} params.startMinutes - minutes from midnight (e.g. 20*60 for 20:00)
 * @param {number} params.durationMinutes
 * @param {string} params.title
 * @returns {object} New event
 */
export const createPlannerEvent = ({ date, startMinutes, durationMinutes, title }) => ({
  id: `planner-${Date.now()}`,
  date,
  startMinutes,
  durationMinutes,
  title: title || '',
  createdAt: Date.now(),
})
