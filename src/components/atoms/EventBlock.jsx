import React, { useRef, useState, useCallback, useEffect } from 'react'
import {
  PLANNER_START_MINUTES,
  PLANNER_END_MINUTES,
  PLANNER_SLOT_DURATION_MINUTES,
} from '../../utils/dateUtils'
import './EventBlock.css'

const TOTAL_PLANNER_MINUTES = PLANNER_END_MINUTES - PLANNER_START_MINUTES

function formatTimeRange(startMinutes, durationMinutes) {
  const startH = Math.floor(startMinutes / 60) % 24
  const startM = startMinutes % 60
  const endMinutes = startMinutes + durationMinutes
  const endH = Math.floor(endMinutes / 60) % 24
  const endM = endMinutes % 60
  return `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')} – ${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
}

/** Snap minutes-from-midnight to planner slot (30 min) and clamp to planner range. */
function clampAndSnapStart(startMinutes, durationMinutes) {
  const minStart = PLANNER_START_MINUTES
  const maxStart = PLANNER_END_MINUTES - durationMinutes
  const clamped = Math.max(minStart, Math.min(maxStart, startMinutes))
  const slotIndex = Math.round((clamped - PLANNER_START_MINUTES) / PLANNER_SLOT_DURATION_MINUTES)
  const snapped = PLANNER_START_MINUTES + slotIndex * PLANNER_SLOT_DURATION_MINUTES
  return Math.max(minStart, Math.min(maxStart, snapped))
}

/**
 * EventBlock – single event card on the planner timeline.
 * Positioned by top/height. Delete via keyboard; resize via bottom-edge drag; move via body drag.
 *
 * @param {object} event - { id, title, startMinutes, durationMinutes }
 * @param {number} totalHeightPx - Height of the events lane (for positioning)
 * @param {function} onDelete - (id) => void
 * @param {function} onResize - (id, newDurationMinutes) => void
 * @param {function} onMove - (id, newStartMinutes) => void
 */
function EventBlock({ event, totalHeightPx, onDelete, onResize, onMove }) {
  const { id, title, startMinutes, durationMinutes } = event
  const blockRef = useRef(null)
  const [isResizing, setIsResizing] = useState(false)
  const [dragDuration, setDragDuration] = useState(null)
  const dragStartY = useRef(0)
  const dragStartDuration = useRef(0)
  const lastResizeDuration = useRef(null)

  const [isMoving, setIsMoving] = useState(false)
  const [dragOffsetPx, setDragOffsetPx] = useState(0)
  const [isSettling, setIsSettling] = useState(false)
  const moveStartY = useRef(0)
  const dragOffsetPxRef = useRef(0)

  const duration = dragDuration !== null ? dragDuration : durationMinutes
  const fromStart = startMinutes - PLANNER_START_MINUTES
  const topPercent = (fromStart / TOTAL_PLANNER_MINUTES) * 100
  const heightPercent = (duration / TOTAL_PLANNER_MINUTES) * 100

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        onDelete(id)
      }
    },
    [id, onDelete]
  )

  const handleResizeMouseDown = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setIsResizing(true)
      dragStartY.current = e.clientY
      dragStartDuration.current = durationMinutes
    },
    [durationMinutes]
  )

  const handleMoveMouseDown = useCallback(
    (e) => {
      if (e.target.closest('.event-block__resize-handle')) return
      e.preventDefault()
      moveStartY.current = e.clientY
      setDragOffsetPx(0)
      setIsSettling(false)
      setIsMoving(true)
    },
    []
  )

  useEffect(() => {
    if (!isResizing) return
    const onMoveResize = (e) => {
      const dy = e.clientY - dragStartY.current
      const slotHeightPx = totalHeightPx / 8
      const deltaSlots = dy / slotHeightPx
      const deltaMinutes = Math.round(deltaSlots * 30)
      const newDuration = Math.max(15, dragStartDuration.current + deltaMinutes)
      lastResizeDuration.current = newDuration
      setDragDuration(newDuration)
    }
    const onUp = () => {
      const finalDuration = lastResizeDuration.current ?? durationMinutes
      onResize(id, finalDuration)
      setIsResizing(false)
      setDragDuration(null)
      lastResizeDuration.current = null
    }
    window.addEventListener('mousemove', onMoveResize)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMoveResize)
      window.removeEventListener('mouseup', onUp)
    }
  }, [isResizing, id, durationMinutes, onResize, totalHeightPx])

  useEffect(() => {
    dragOffsetPxRef.current = dragOffsetPx
  }, [dragOffsetPx])

  useEffect(() => {
    if (!isMoving || !onMove) return
    const onMoveHandler = (e) => {
      const dy = e.clientY - moveStartY.current
      dragOffsetPxRef.current = dy
      setDragOffsetPx(dy)
    }
    const onUp = () => {
      const offsetPx = dragOffsetPxRef.current
      const offsetMinutes = (offsetPx / totalHeightPx) * TOTAL_PLANNER_MINUTES
      const rawStart = startMinutes + offsetMinutes
      const newStart = clampAndSnapStart(rawStart, duration)
      const oldTopPx = ((startMinutes - PLANNER_START_MINUTES) / TOTAL_PLANNER_MINUTES) * totalHeightPx
      const newTopPx = ((newStart - PLANNER_START_MINUTES) / TOTAL_PLANNER_MINUTES) * totalHeightPx
      const settleOffsetPx = oldTopPx + offsetPx - newTopPx

      onMove(id, newStart)
      setIsMoving(false)
      if (Math.abs(settleOffsetPx) >= 1) {
        setDragOffsetPx(settleOffsetPx)
        setIsSettling(true)
      } else {
        setDragOffsetPx(0)
      }
    }
    window.addEventListener('mousemove', onMoveHandler)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMoveHandler)
      window.removeEventListener('mouseup', onUp)
    }
  }, [isMoving, id, startMinutes, duration, onMove, totalHeightPx])

  useEffect(() => {
    if (!isSettling) return
    const frame = requestAnimationFrame(() => {
      setDragOffsetPx(0)
    })
    return () => cancelAnimationFrame(frame)
  }, [isSettling])

  const handleTransitionEnd = useCallback((e) => {
    if (e.propertyName === 'transform') {
      setIsSettling(false)
    }
  }, [])

  const hasTransform = isMoving || isSettling || dragOffsetPx !== 0
  const transformStyle = hasTransform ? { transform: `translateY(${dragOffsetPx}px)` } : undefined

  return (
    <div
      ref={blockRef}
      className={`event-block ${isMoving ? 'event-block--moving' : ''} ${isSettling ? 'event-block--settling' : ''}`}
      style={{
        top: `${topPercent}%`,
        height: `${heightPercent}%`,
        ...transformStyle,
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMoveMouseDown}
      onTransitionEnd={handleTransitionEnd}
      role="button"
      aria-label={`${title}, ${formatTimeRange(startMinutes, duration)}. Press Delete to remove. Drag to move, drag bottom edge to resize.`}
    >
      <span className="event-block__title">{title || 'Event'}</span>
      <span className="event-block__time">
        {formatTimeRange(startMinutes, duration)}
      </span>
      <span
        className="event-block__resize-handle"
        onMouseDown={handleResizeMouseDown}
        aria-hidden
      />
    </div>
  )
}

EventBlock.displayName = 'EventBlock'

export default EventBlock
