import React, { useMemo, useState, useRef, useEffect } from 'react'
import './Calendar.css'
import '../../tokens/spacings.css'
import '../../tokens/typography.css'
import '../../components/DayHeader.css'
import '../../components/DayAgenda.css'
import DayAgenda from '../../components/DayAgenda'
import DayPlanner from '../../components/DayPlanner'
import InboxNotes from '../../components/InboxNotes/InboxNotes'
import TaskItem from '../../components/TaskItem'
import { DayOfWeekText } from '../../components/atoms'
import { useLocalStorage } from '../../hooks'
import { getWeekStart, formatDate, getRussianDayName } from '../../utils/dateUtils'
import postBoxIcon from '../../icons/Stroked 2px/Post Box.svg'

const Calendar = () => {
  // Goals state and handlers
  const [goals, setGoals] = useLocalStorage('calendar-goals', [])
  const goalRefs = useRef([])
  const [focusGoalIndex, setFocusGoalIndex] = useState(null)

  // Helper: focus existing input or enter edit mode on TaskItem
  const focusOrEnterEditGoal = (goalElement) => {
    if (!goalElement) return

    const existingInput = goalElement.querySelector('input[type="text"]')
    if (existingInput) {
      existingInput.focus()
      return
    }

    const taskTextElement = goalElement.querySelector('.task-item__text')
    if (taskTextElement) {
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
      taskTextElement.dispatchEvent(clickEvent)

      setTimeout(() => {
        const newInput = goalElement.querySelector('input[type="text"]')
        if (newInput) {
          newInput.focus()
        }
      }, 0)
    }
  }

  // Manage focus for goals
  useEffect(() => {
    if (goals.length === 0) return

    if (focusGoalIndex !== null) {
      const targetIndex = Math.max(0, Math.min(focusGoalIndex, goals.length - 1))
      setTimeout(() => {
        const goalElement = goalRefs.current[targetIndex]
        focusOrEnterEditGoal(goalElement)
      }, 0)
      
      setFocusGoalIndex(null)
    }
  }, [goals, focusGoalIndex])

  const handleGoalUpdate = (savedValue, goalIndex) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/0a1f3231-f882-46b3-abf6-83c831abb2fc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Calendar.jsx:handleGoalUpdate',message:'goal update called',data:{savedValue,goalIndex},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H7'})}).catch(()=>{});
    // #endregion
    setGoals((prevGoals) => {
      if (!savedValue.trim()) {
        return prevGoals.filter((_, index) => index !== goalIndex)
      }

      const newGoals = [...prevGoals]
      if (newGoals[goalIndex]) {
        newGoals[goalIndex] = { ...newGoals[goalIndex], text: savedValue }
      }
      return newGoals
    })
  }

  const handleGoalEnter = (savedValue, goalIndex) => {
    setGoals((prevGoals) => {
      const newGoals = [...prevGoals]
      if (newGoals[goalIndex]) {
        newGoals[goalIndex] = { ...newGoals[goalIndex], text: savedValue }
      }
      
      const newGoal = {
        id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: '',
        checked: false
      }

      newGoals.splice(goalIndex + 1, 0, newGoal)
      
      return newGoals
    })

    setFocusGoalIndex(goalIndex + 1)
  }

  const handleGoalDelete = (goalIndex) => {
    setGoals((prevGoals) => {
      return prevGoals.filter((_, index) => index !== goalIndex)
    })

    setFocusGoalIndex(Math.max(goalIndex - 1, 0))
  }

  const handleGoalToggle = (goalId, newChecked) => {
    setGoals((prevGoals) => 
      prevGoals.map(goal => 
        goal.id === goalId ? { ...goal, checked: newChecked } : goal
      )
    )
  }

  const handleGoalsContainerClick = (e) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/0a1f3231-f882-46b3-abf6-83c831abb2fc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Calendar.jsx:handleGoalsContainerClick',message:'goals container clicked',data:{targetClass:e.target.className},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H7'})}).catch(()=>{});
    // #endregion
    if (
      e.target.closest('.day-header') ||
      e.target.closest('.day-agenda__task-item') ||
      e.target.closest('input') ||
      e.target.closest('button')
    ) {
      return
    }

    setGoals((prevGoals) => {
      const lastGoal = prevGoals[prevGoals.length - 1]
      
      if (lastGoal && !lastGoal.text) {
        setTimeout(() => setFocusGoalIndex(prevGoals.length - 1), 0)
        return prevGoals
      }
      
      const newGoal = {
        id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: '',
        checked: false
      }
      
      setTimeout(() => setFocusGoalIndex(prevGoals.length), 0)
      
      return [...prevGoals, newGoal]
    })
  }

  // Generate 6 days starting from Monday of current week
  const days = useMemo(() => {
    const weekStart = getWeekStart(new Date())
    const daysArray = []
    
    // Generate 6 days: Monday through Saturday
    for (let i = 0; i < 6; i++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      
      // Add some test tasks for the first day to verify TaskItem rendering
      const testTasks = i === 0 ? [
        { id: `task-${i}-1`, text: 'Тестовая задача 1', checked: false },
        { id: `task-${i}-2`, text: 'Тестовая задача 2', checked: true }
      ] : []
      
      daysArray.push({
        id: `day-${i}`,
        date: formatDate(date, 'YYYY-MM-DD'),
        dayOfWeek: getRussianDayName(date),
        dateObj: date,
        tasks: testTasks
      })
    }
    
    return daysArray
  }, [])
  return (
    <div className="calendar-page">
      <div className="calendar-page__grid">
        {/* First main div - 3 columns */}
        <div className="calendar-page__left-section">
          {/* Active Plan Day */}
          <div className="calendar-page__active-plan-day">
            <DayPlanner />
          </div>

          {/* Inbox notes */}
          <div className="calendar-page__inbox-notes">
            <div className="calendar-page__inbox-notes-header">
              <img
                src={postBoxIcon}
                alt=""
                className="calendar-page__inbox-notes-icon"
                width={24}
                height={24}
              />
              <h2 className="text-ttn-600-l">Заметки</h2>
            </div>
            <InboxNotes />
          </div>
        </div>

        {/* Second main div - 9 columns */}
        <div className="calendar-page__right-section">
          <div className="calendar-page__calendar">
            <div className="calendar-page__days-grid">
              {/* 6 days in 3x2 grid, each with DayAgenda */}
              {days.map((day) => (
                <DayAgenda
                  key={day.id}
                  className="calendar-page__day"
                  date={day.date}
                  dayOfWeek={day.dayOfWeek}
                  tasks={day.tasks}
                />
              ))}
              {/* Goals column on third row */}
              <div 
                className="calendar-page__day calendar-page__goals day-agenda"
                onClick={handleGoalsContainerClick}
              >
                <div className="day-header">
                  <div className="day-header__text-wrapper">
                    <DayOfWeekText>Цели</DayOfWeekText>
                  </div>
                </div>
                <div className="day-agenda__tasks-list">
                  {goals.map((goal, index) => (
                    <div 
                      key={goal.id}
                      ref={(el) => { goalRefs.current[index] = el }}
                      className="day-agenda__task-item"
                    >
                      <TaskItem
                        id={goal.id}
                        text={goal.text}
                        checked={goal.checked || false}
                        onToggle={(newChecked) => handleGoalToggle(goal.id, newChecked)}
                        onSave={(savedValue) => handleGoalUpdate(savedValue, index)}
                        onEnter={(savedValue) => handleGoalEnter(savedValue, index)}
                        onDelete={() => handleGoalDelete(index)}
                        autoFocus={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar
