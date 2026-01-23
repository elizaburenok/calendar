import React, { useState, useEffect, useRef } from 'react'
import { Checkbox, DateText, DayOfWeekText, NoteLink, TaskText } from '../../components/atoms'
import { DayAgenda, DayHeader, TaskItem } from '../../components'
import './ComponentTest.css'
import '../../tokens/colors.css'
import '../../tokens/typography.css'

const ComponentTest = () => {
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(true)
  const [checked3, setChecked3] = useState(false)
  const [task1, setTask1] = useState(false)
  const [task2, setTask2] = useState(true)
  const [task3, setTask3] = useState(false)
  
  // State for managing notes with Enter/Delete functionality
  const [notes, setNotes] = useState([''])
  const noteRefs = useRef([])

  // Helper: focus existing input or programmatically enter edit mode on NoteLink
  const focusOrEnterEdit = (noteElement) => {
    if (!noteElement) return

    // If input already exists, just focus it
    const existingInput = noteElement.querySelector('input')
    if (existingInput) {
      existingInput.focus()
      return
    }

    // Otherwise, dispatch a mousedown on the inner .note-link to trigger edit mode
    const noteLinkElement = noteElement.querySelector('.note-link')
    if (noteLinkElement) {
      const mouseDownEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true
      })
      noteLinkElement.dispatchEvent(mouseDownEvent)

      // After NoteLink enters edit mode, focus the newly created input
      setTimeout(() => {
        const newInput = noteElement.querySelector('input')
        if (newInput) {
          newInput.focus()
        }
      }, 0)
    }
  }
  
  // Auto-focus the last empty note when a new one is created
  useEffect(() => {
    if (notes.length === 0) return
    const lastIndex = notes.length - 1
    if (notes[lastIndex] === '' && noteRefs.current[lastIndex]) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        const noteElement = noteRefs.current[lastIndex]
        focusOrEnterEdit(noteElement)
      }, 0)
    }
  }, [notes])
  
  // DayAgenda tasks state
  const [dayAgendaTasks, setDayAgendaTasks] = useState([
    {
      id: 'task-1',
      text: 'Проверить что ребята принесли примеры и подписали основные экраны для наглядности',
      checked: false
    },
    {
      id: 'task-2',
      text: 'Проверить что ребята принесли примеры и подписали основные экраны для наглядности',
      checked: false
    },
    {
      id: 'task-3',
      text: 'Проверить что ребята принесли примеры и подписали основные экраны для наглядности',
      checked: false
    }
  ])
  
  const handleDayAgendaTaskToggle = (taskId, newChecked) => {
    setDayAgendaTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, checked: newChecked } : task
      )
    )
  }

  // Handle note Enter - save current note and create new empty one
  const handleNoteEnter = (savedValue, noteIndex) => {
    setNotes(prevNotes => {
      const newNotes = [...prevNotes]
      // Update the current note with saved value
      newNotes[noteIndex] = savedValue
      // Add a new empty note at the end
      newNotes.push('')
      return newNotes
    })
  }

  // Handle note Delete - remove current note when it's empty
  const handleNoteDelete = (noteIndex) => {
    setNotes(prevNotes => {
      const newNotes = prevNotes.filter((_, index) => index !== noteIndex)
      // Always keep at least one empty note so user can create a new one
      return newNotes.length > 0 ? newNotes : ['']
    })

    // After deletion, move focus to the previous note (if any)
    setTimeout(() => {
      const targetIndex = Math.max(noteIndex - 1, 0)
      const noteElement = noteRefs.current[targetIndex]
      focusOrEnterEdit(noteElement)
    }, 0)
  }

  return (
    <div className="component-test">
      <div className="component-test-header">
        <h1>Component Test - Atoms</h1>
        <p>Testing atomic components from Figma design system</p>
      </div>

      <div className="component-test-content">
        <section className="component-test-section">
          <h2>Checkbox</h2>
          <div className="component-test-grid">
            <div className="component-test-item">
              <div className="component-test-label">Unchecked (Active)</div>
              <div className="component-test-preview">
                <Checkbox 
                  checked={checked1} 
                  onChange={setChecked1}
                  id="checkbox-1"
                />
              </div>
              <div className="component-test-code">
                &lt;Checkbox checked={'{false}'} onChange={'{setChecked}'} /&gt;
              </div>
            </div>

            <div className="component-test-item">
              <div className="component-test-label">Checked</div>
              <div className="component-test-preview">
                <Checkbox 
                  checked={checked2} 
                  onChange={setChecked2}
                  id="checkbox-2"
                />
              </div>
              <div className="component-test-code">
                &lt;Checkbox checked={'{true}'} onChange={'{setChecked}'} /&gt;
              </div>
            </div>

            <div className="component-test-item">
              <div className="component-test-label">Disabled (Unchecked)</div>
              <div className="component-test-preview">
                <Checkbox 
                  checked={false} 
                  disabled={true}
                  id="checkbox-3"
                />
              </div>
              <div className="component-test-code">
                &lt;Checkbox checked={'{false}'} disabled={'{true}'} /&gt;
              </div>
            </div>

            <div className="component-test-item">
              <div className="component-test-label">Disabled (Checked)</div>
              <div className="component-test-preview">
                <Checkbox 
                  checked={true} 
                  disabled={true}
                  id="checkbox-4"
                />
              </div>
              <div className="component-test-code">
                &lt;Checkbox checked={'{true}'} disabled={'{true}'} /&gt;
              </div>
            </div>

            <div className="component-test-item">
              <div className="component-test-label">Interactive Example</div>
              <div className="component-test-preview">
                <Checkbox 
                  checked={checked3} 
                  onChange={setChecked3}
                  id="checkbox-5"
                />
                <span style={{ marginLeft: '12px', color: 'var(--primitive-primary-on-inverse, #ffffff)' }}>
                  {checked3 ? 'Checked' : 'Unchecked'}
                </span>
              </div>
              <div className="component-test-code">
                Interactive checkbox with state tracking
              </div>
            </div>
          </div>
        </section>

        <section className="component-test-section">
          <h2>DateText</h2>
          <div className="component-test-grid">
            <div className="component-test-item">
              <div className="component-test-label">Default (Russian Date Format)</div>
              <div className="component-test-preview">
                <DateText>16 января</DateText>
              </div>
              <div className="component-test-code">
                &lt;DateText&gt;16 января&lt;/DateText&gt;
              </div>
            </div>

            <div className="component-test-item">
              <div className="component-test-label">Different Date</div>
              <div className="component-test-preview">
                <DateText>1 февраля</DateText>
              </div>
              <div className="component-test-code">
                &lt;DateText&gt;1 февраля&lt;/DateText&gt;
              </div>
            </div>

            <div className="component-test-item">
              <div className="component-test-label">On Dark Background</div>
              <div className="component-test-preview" style={{ backgroundColor: '#191919', padding: '16px', borderRadius: '4px' }}>
                <DateText>16 января</DateText>
              </div>
              <div className="component-test-code">
                DateText on dark background (as designed)
              </div>
            </div>
          </div>
        </section>

        <section className="component-test-section">
          <h2>DayOfWeekText</h2>
          <div className="component-test-grid">
            <div className="component-test-item">
              <div className="component-test-label">Default (Russian Day Format)</div>
              <div className="component-test-preview">
                <DayOfWeekText>Понедельник</DayOfWeekText>
              </div>
              <div className="component-test-code">
                &lt;DayOfWeekText&gt;Понедельник&lt;/DayOfWeekText&gt;
              </div>
            </div>

            <div className="component-test-item">
              <div className="component-test-label">Different Day</div>
              <div className="component-test-preview">
                <DayOfWeekText>Вторник</DayOfWeekText>
              </div>
              <div className="component-test-code">
                &lt;DayOfWeekText&gt;Вторник&lt;/DayOfWeekText&gt;
              </div>
            </div>

            <div className="component-test-item">
              <div className="component-test-label">On Dark Background</div>
              <div className="component-test-preview" style={{ backgroundColor: '#191919', padding: '16px', borderRadius: '4px' }}>
                <DayOfWeekText>Понедельник</DayOfWeekText>
              </div>
              <div className="component-test-code">
                DayOfWeekText on dark background (as designed)
              </div>
            </div>
          </div>
        </section>

        <section className="component-test-section">
          <h2>NoteLink</h2>
          <div className="component-test-grid">
            <div className="component-test-item">
              <div className="component-test-label">Default (Interactive)</div>
              <div className="component-test-preview" style={{ display: 'flex', flexDirection: 'column', gap: 0, overflow: 'visible', minHeight: 'auto' }}>
                {notes.map((note, index) => (
                  <div
                    key={index}
                    ref={(el) => { noteRefs.current[index] = el }}
                    style={{ display: 'flex' }}
                  >
                    <NoteLink
                      initialValue={note}
                      autoFocus={note === '' && index === notes.length - 1}
                      onEnter={(savedValue) => handleNoteEnter(savedValue, index)}
                      onDelete={() => handleNoteDelete(index)}
                      onClick={() => {}}
                    />
                  </div>
                ))}
              </div>
              <div className="component-test-code">
                &lt;NoteLink onClick={'{handleClick}'} onEnter={'{handleNoteEnter}'} /&gt;
              </div>
            </div>

            <div className="component-test-item">
              <div className="component-test-label">On Dark Background</div>
              <div className="component-test-preview" style={{ backgroundColor: '#191919', padding: '16px', borderRadius: '4px' }}>
                <NoteLink onClick={() => alert('NoteLink clicked!')} />
              </div>
              <div className="component-test-code">
                NoteLink on dark background (as designed)
              </div>
            </div>

            <div className="component-test-item">
              <div className="component-test-label">Multiple NoteLinks</div>
              <div className="component-test-preview" style={{ backgroundColor: '#191919', padding: '16px', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <NoteLink onClick={() => alert('Note 1 clicked!')} />
                <NoteLink onClick={() => alert('Note 2 clicked!')} />
                <NoteLink onClick={() => alert('Note 3 clicked!')} />
              </div>
              <div className="component-test-code">
                Multiple NoteLinks stacked vertically
              </div>
            </div>
          </div>
        </section>

        <section className="component-test-section">
          <h2>DayHeader (Assembled Component)</h2>
          <div className="component-test-grid">
            <div className="component-test-item component-test-item--full-width">
              <div className="component-test-label">From Figma Design</div>
              <div className="component-test-preview component-test-preview--task-item" style={{ backgroundColor: '#191919', padding: '16px', borderRadius: '4px' }}>
                <DayHeader
                  date="16 января"
                  dayOfWeek="Понедельник"
                  onNoteClick={() => alert('Note clicked!')}
                />
              </div>
              <div className="component-test-code">
                &lt;DayHeader date="16 января" dayOfWeek="Понедельник" onNoteClick={'{handleClick}'} /&gt;
              </div>
            </div>

            <div className="component-test-item component-test-item--full-width">
              <div className="component-test-label">Different Date</div>
              <div className="component-test-preview component-test-preview--task-item" style={{ backgroundColor: '#191919', padding: '16px', borderRadius: '4px' }}>
                <DayHeader
                  date="1 февраля"
                  dayOfWeek="Вторник"
                  onNoteClick={() => alert('Note clicked!')}
                />
              </div>
              <div className="component-test-code">
                &lt;DayHeader date="1 февраля" dayOfWeek="Вторник" onNoteClick={'{handleClick}'} /&gt;
              </div>
            </div>
          </div>
        </section>

        <section className="component-test-section">
          <h2>DayAgenda (Full Component from Figma)</h2>
          <div className="component-test-grid">
            <div className="component-test-item component-test-item--full-width">
              <div className="component-test-label">From Figma Design - Complete Day View</div>
              <div className="component-test-preview component-test-preview--task-item" style={{ backgroundColor: '#191919', padding: '16px', borderRadius: '4px' }}>
                <DayAgenda
                  date="16 января"
                  dayOfWeek="Понедельник"
                  tasks={dayAgendaTasks}
                  onNoteClick={() => alert('Note clicked!')}
                  onTaskToggle={handleDayAgendaTaskToggle}
                />
              </div>
              <div className="component-test-code">
                &lt;DayAgenda
                  date="16 января"
                  dayOfWeek="Понедельник"
                  tasks={'{tasks}'}
                  onNoteClick={'{handleNoteClick}'}
                  onTaskToggle={'{handleTaskToggle}'}
                /&gt;
              </div>
            </div>

            <div className="component-test-item component-test-item--full-width">
              <div className="component-test-label">Different Date with Completed Tasks</div>
              <div className="component-test-preview component-test-preview--task-item" style={{ backgroundColor: '#191919', padding: '16px', borderRadius: '4px' }}>
                <DayAgenda
                  date="1 февраля"
                  dayOfWeek="Вторник"
                  tasks={[
                    {
                      id: 'task-a',
                      text: 'Завершенная задача',
                      checked: true
                    },
                    {
                      id: 'task-b',
                      text: 'Активная задача',
                      checked: false
                    }
                  ]}
                  onNoteClick={() => alert('Note clicked!')}
                  onTaskToggle={(taskId, checked) => console.log('Task toggled:', taskId, checked)}
                />
              </div>
              <div className="component-test-code">
                &lt;DayAgenda
                  date="1 февраля"
                  dayOfWeek="Вторник"
                  tasks={'{tasksWithMixedStates}'}
                  onNoteClick={'{handleNoteClick}'}
                  onTaskToggle={'{handleTaskToggle}'}
                /&gt;
              </div>
            </div>
          </div>
        </section>

        <section className="component-test-section">
          <h2>TaskText</h2>
          <div className="component-test-grid">
            <div className="component-test-item">
              <div className="component-test-label">Default (Secondary - Light Grey, Size M)</div>
              <div className="component-test-preview">
                <TaskText>
                  Проверить что ребята принесли
                  примеры и подписали основные
                  экраны для наглядности
                </TaskText>
              </div>
              <div className="component-test-code">
                &lt;TaskText&gt;Multi-line text content&lt;/TaskText&gt;
              </div>
            </div>

            <div className="component-test-item">
              <div className="component-test-label">Secondary Color</div>
              <div className="component-test-preview">
                <TaskText color="secondary">
                  Проверить что ребята принесли
                  примеры и подписали основные
                  экраны для наглядности
                </TaskText>
              </div>
              <div className="component-test-code">
                &lt;TaskText color="secondary"&gt;Text&lt;/TaskText&gt;
              </div>
            </div>

            <div className="component-test-item">
              <div className="component-test-label">Size Small (S)</div>
              <div className="component-test-preview">
                <TaskText variant="s">
                  Проверить что ребята принесли
                  примеры и подписали основные
                  экраны для наглядности
                </TaskText>
              </div>
              <div className="component-test-code">
                &lt;TaskText variant="s"&gt;Text&lt;/TaskText&gt;
              </div>
            </div>

            <div className="component-test-item">
              <div className="component-test-label">Size Large (L)</div>
              <div className="component-test-preview">
                <TaskText variant="l">
                  Проверить что ребята принесли
                  примеры и подписали основные
                  экраны для наглядности
                </TaskText>
              </div>
              <div className="component-test-code">
                &lt;TaskText variant="l"&gt;Text&lt;/TaskText&gt;
              </div>
            </div>

            <div className="component-test-item">
              <div className="component-test-label">Medium Weight (500)</div>
              <div className="component-test-preview">
                <TaskText weight="500">
                  Проверить что ребята принесли
                  примеры и подписали основные
                  экраны для наглядности
                </TaskText>
              </div>
              <div className="component-test-code">
                &lt;TaskText weight="500"&gt;Text&lt;/TaskText&gt;
              </div>
            </div>

            <div className="component-test-item">
              <div className="component-test-label">Single Line Example</div>
              <div className="component-test-preview">
                <TaskText>
                  Single line task description
                </TaskText>
              </div>
              <div className="component-test-code">
                &lt;TaskText&gt;Single line&lt;/TaskText&gt;
              </div>
            </div>
          </div>
        </section>

        <section className="component-test-section">
          <h2>TaskItem (Assembled Component)</h2>
          <div className="component-test-grid">
            <div className="component-test-item component-test-item--full-width">
              <div className="component-test-label">From Figma Design (Unchecked)</div>
              <div className="component-test-preview component-test-preview--task-item">
                <TaskItem
                  text="Проверить что ребята принесли
примеры и подписали основные
экраны для наглядности"
                  checked={task1}
                  onToggle={setTask1}
                  id="task-item-1"
                />
              </div>
              <div className="component-test-code">
                &lt;TaskItem text="..." checked={'{false}'} onToggle={'{setChecked}'} /&gt;
              </div>
            </div>

            <div className="component-test-item component-test-item--full-width">
              <div className="component-test-label">Checked State</div>
              <div className="component-test-preview component-test-preview--task-item">
                <TaskItem
                  text="Проверить что ребята принесли
примеры и подписали основные
экраны для наглядности"
                  checked={task2}
                  onToggle={setTask2}
                  id="task-item-2"
                />
              </div>
              <div className="component-test-code">
                &lt;TaskItem text="..." checked={'{true}'} onToggle={'{setChecked}'} /&gt;
              </div>
            </div>

            <div className="component-test-item component-test-item--full-width">
              <div className="component-test-label">Disabled (Unchecked)</div>
              <div className="component-test-preview component-test-preview--task-item">
                <TaskItem
                  text="Проверить что ребята принесли
примеры и подписали основные
экраны для наглядности"
                  checked={false}
                  disabled={true}
                  id="task-item-3"
                />
              </div>
              <div className="component-test-code">
                &lt;TaskItem text="..." checked={'{false}'} disabled={'{true}'} /&gt;
              </div>
            </div>

            <div className="component-test-item component-test-item--full-width">
              <div className="component-test-label">Single Line Task</div>
              <div className="component-test-preview component-test-preview--task-item">
                <TaskItem
                  text="Complete the project documentation"
                  checked={task3}
                  onToggle={setTask3}
                  id="task-item-4"
                />
              </div>
              <div className="component-test-code">
                &lt;TaskItem text="Single line task" checked={'{checked}'} onToggle={'{setChecked}'} /&gt;
              </div>
            </div>

            <div className="component-test-item component-test-item--full-width">
              <div className="component-test-label">Interactive Example</div>
              <div className="component-test-preview component-test-preview--task-item">
                <TaskItem
                  text="Click the checkbox to toggle this task"
                  checked={task1}
                  onToggle={setTask1}
                  id="task-item-5"
                />
              </div>
              <div className="component-test-code">
                Interactive TaskItem with state tracking
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ComponentTest
