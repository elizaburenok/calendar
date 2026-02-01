import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
  getMinutesFromMidnight,
  snapToWidgetGrid,
  todayAtMinutes,
  WIDGET_START_MINUTES,
  WIDGET_END_MINUTES,
  WIDGET_SNAP_MINUTES,
} from '../../utils/dateUtils'
import './WidgetEventBlock.css'

/**
 * Single event block for the day planner widget.
 * Position and height are derived from startTime/endTime and the visible window.
 * Supports: drag to move, resize (top/bottom handles), inline title editing.
 * 
 * Props:
 * - event: { id, title, startTime, endTime }
 * - visibleStartMinutes, visibleEndMinutes: visible time window
 * - totalHeightPx: total height of visible window
 * - pxPerHour: pixels per hour (45px from Figma)
 * - timeLabelWidth: width of time labels (32px)
 * - onDelete: callback when delete is triggered
 * - onUpdate: callback when event is updated (title, startTime, endTime)
 * - autoFocus: if true, immediately enter edit mode (for newly created events)
 * - onEditStart: callback when edit mode starts
 */
function WidgetEventBlock({
  event,
  visibleStartMinutes,
  visibleEndMinutes,
  totalHeightPx,
  pxPerHour = 45,
  timeLabelWidth = 32,
  onDelete,
  onUpdate,
  autoFocus = false,
  onEditStart,
}) {
  const [isEditing, setIsEditing] = useState(autoFocus)
  const [editedTitle, setEditedTitle] = useState(event.title)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(null) // 'top' | 'bottom' | null
  const inputRef = useRef(null)
  const blockRef = useRef(null)
  const dragStartRef = useRef({ y: 0, startMinutes: 0, endMinutes: 0 })

  const startDate = new Date(event.startTime)
  const endDate = new Date(event.endTime)
  const startMinutes = getMinutesFromMidnight(startDate)
  const endMinutes = getMinutesFromMidnight(endDate)
  const durationMinutes = endMinutes - startMinutes

  // Calculate slot index and position within the timeline
  // Time rows are 13px tall with 45px gaps between them
  const ROW_HEIGHT = 13 // time row height from Figma
  const GAP = 45 // gap between rows from Figma
  const SLOT_TOTAL = ROW_HEIGHT + GAP // 58px per hour

  const hoursFromStart = (startMinutes - visibleStartMinutes) / 60
  const durationHours = durationMinutes / 60

  // Top position: skip past the hours before this event
  const topPx = hoursFromStart * SLOT_TOTAL + 9

  // Height: based on duration, mapped to the slot spacing
  const heightPx = Math.max(durationHours * SLOT_TOTAL - 10, 30) // min height 30px

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
      onEditStart?.(event.id)
    }
  }, [isEditing, event.id, onEditStart])

  // Sync edited title when event changes
  useEffect(() => {
    setEditedTitle(event.title)
  }, [event.title])

  // Don't render if outside visible range
  if (endMinutes <= visibleStartMinutes || startMinutes >= visibleEndMinutes) {
    return null
  }

  // --- Title Editing (double-click to edit) ---
  const handleTitleDoubleClick = (e) => {
    e.stopPropagation()
    if (!isDragging && !isResizing) {
      setIsEditing(true)
    }
  }

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value)
  }

  const handleTitleBlur = () => {
    setIsEditing(false)
    const trimmedTitle = editedTitle.trim()
    // If title is empty, delete the event (no empty names allowed)
    if (trimmedTitle === '') {
      onDelete?.(event.id)
    } else if (trimmedTitle !== event.title) {
      onUpdate?.(event.id, { title: trimmedTitle })
    }
  }

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      inputRef.current?.blur() // Trigger blur which handles save/delete
    } else if (e.key === 'Escape') {
      setEditedTitle(event.title)
      setIsEditing(false)
      // Return focus to the block
      blockRef.current?.focus()
    }
  }

  // --- Block keyboard handling (for deleting event when selected) ---
  const handleBlockKeyDown = (e) => {
    if (isEditing) return // Don't interfere with title editing
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault()
      onDelete?.(event.id)
    }
  }

  // Focus the block when clicking on it (not on title)
  const handleBlockClick = () => {
    if (!isEditing) {
      blockRef.current?.focus()
    }
  }

  // --- Drag to Move ---
  const handleDragStart = useCallback((e) => {
    if (isEditing || isResizing) return
    e.stopPropagation()
    e.preventDefault()
    
    setIsDragging(true)
    dragStartRef.current = {
      y: e.clientY,
      startMinutes,
      endMinutes,
    }

    const handleMouseMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - dragStartRef.current.y
      const deltaMinutes = (deltaY / SLOT_TOTAL) * 60 // Convert px to minutes
      
      let newStart = dragStartRef.current.startMinutes + deltaMinutes
      let newEnd = dragStartRef.current.endMinutes + deltaMinutes
      const duration = dragStartRef.current.endMinutes - dragStartRef.current.startMinutes
      
      // Snap to grid
      newStart = snapToWidgetGrid(newStart)
      newEnd = newStart + duration
      
      // Clamp to widget bounds
      if (newStart < WIDGET_START_MINUTES) {
        newStart = WIDGET_START_MINUTES
        newEnd = newStart + duration
      }
      if (newEnd > WIDGET_END_MINUTES) {
        newEnd = WIDGET_END_MINUTES
        newStart = newEnd - duration
      }
      
      onUpdate?.(event.id, {
        startTime: todayAtMinutes(newStart).toISOString(),
        endTime: todayAtMinutes(newEnd).toISOString(),
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [isEditing, isResizing, startMinutes, endMinutes, event.id, onUpdate, SLOT_TOTAL])

  // --- Resize ---
  const handleResizeStart = useCallback((edge) => (e) => {
    e.stopPropagation()
    e.preventDefault()
    
    setIsResizing(edge)
    dragStartRef.current = {
      y: e.clientY,
      startMinutes,
      endMinutes,
    }

    const handleMouseMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - dragStartRef.current.y
      const deltaMinutes = (deltaY / SLOT_TOTAL) * 60

      if (edge === 'top') {
        let newStart = dragStartRef.current.startMinutes + deltaMinutes
        newStart = snapToWidgetGrid(newStart)
        // Ensure minimum duration (one snap step)
        const minEnd = newStart + WIDGET_SNAP_MINUTES
        if (minEnd <= dragStartRef.current.endMinutes && newStart >= WIDGET_START_MINUTES) {
          onUpdate?.(event.id, {
            startTime: todayAtMinutes(newStart).toISOString(),
          })
        }
      } else if (edge === 'bottom') {
        let newEnd = dragStartRef.current.endMinutes + deltaMinutes
        newEnd = snapToWidgetGrid(newEnd)
        // Ensure minimum duration (one snap step)
        const maxStart = newEnd - WIDGET_SNAP_MINUTES
        if (maxStart >= dragStartRef.current.startMinutes && newEnd <= WIDGET_END_MINUTES) {
          onUpdate?.(event.id, {
            endTime: todayAtMinutes(newEnd).toISOString(),
          })
        }
      }
    }

    const handleMouseUp = () => {
      setIsResizing(null)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [startMinutes, endMinutes, event.id, onUpdate, SLOT_TOTAL])

  const blockClassName = [
    'widget-event-block',
    isDragging && 'widget-event-block--dragging',
    isResizing && 'widget-event-block--resizing',
    isEditing && 'widget-event-block--editing',
  ].filter(Boolean).join(' ')

  return (
    <div
      ref={blockRef}
      className={blockClassName}
      style={{
        top: `${topPx}px`,
        height: `${heightPx}px`,
        left: `${timeLabelWidth}px`,
      }}
      data-event-id={event.id}
      tabIndex={0}
      onMouseDown={handleDragStart}
      onClick={handleBlockClick}
      onKeyDown={handleBlockKeyDown}
    >
      {/* Top resize handle */}
      <div
        className="widget-event-block__resize widget-event-block__resize--top"
        onMouseDown={handleResizeStart('top')}
        aria-label="Изменить время начала"
      />

      {/* Title - double-click to edit */}
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          className="widget-event-block__input"
          value={editedTitle}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          onKeyDown={handleTitleKeyDown}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          className="widget-event-block__title"
          title={event.title}
          onDoubleClick={handleTitleDoubleClick}
        >
          {event.title || 'Без названия'}
        </span>
      )}

      {/* Bottom resize handle */}
      <div
        className="widget-event-block__resize widget-event-block__resize--bottom"
        onMouseDown={handleResizeStart('bottom')}
        aria-label="Изменить время окончания"
      />
    </div>
  )
}

export default WidgetEventBlock
