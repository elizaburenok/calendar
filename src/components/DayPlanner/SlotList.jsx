import React, { useEffect, useRef } from 'react'
import SlotRow from '../atoms/SlotRow'
import {
  PLANNER_SLOTS_COUNT,
  getPlannerSlotLabel,
  getCurrentPlannerSlotIndex,
} from '../../utils/dateUtils'
import './DayPlanner.css'

const SLOT_HEIGHT_PX = 45
const VISIBLE_SLOTS = 5

/**
 * Scrollable list of time slots (8pm–12am). Only 5 slots visible; scroll to current on mount.
 */
function SlotList({ onSlotClick }) {
  const scrollRef = useRef(null)
  const currentIndex = getCurrentPlannerSlotIndex()

  useEffect(() => {
    if (!scrollRef.current) return
    // Scroll so current slot is in upper half of visible area (e.g. 2nd slot from top)
    const targetScrollTop = Math.max(
      0,
      currentIndex * SLOT_HEIGHT_PX - 1 * SLOT_HEIGHT_PX
    )
    scrollRef.current.scrollTop = targetScrollTop
  }, [currentIndex])

  return (
    <div
      ref={scrollRef}
      className="day-planner__slot-list"
      style={{
        '--day-planner-slot-height': `${SLOT_HEIGHT_PX}px`,
        height: VISIBLE_SLOTS * SLOT_HEIGHT_PX,
      }}
    >
      {Array.from({ length: PLANNER_SLOTS_COUNT }, (_, i) => (
        <SlotRow
          key={i}
          slotIndex={i}
          label={getPlannerSlotLabel(i)}
          isCurrent={i === currentIndex}
          onClick={onSlotClick}
        />
      ))}
    </div>
  )
}

export default SlotList
export { SLOT_HEIGHT_PX, VISIBLE_SLOTS }
