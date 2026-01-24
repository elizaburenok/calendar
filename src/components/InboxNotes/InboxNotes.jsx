import React, { useState } from 'react'
import NoteLink from '../atoms/NoteLink'
import './InboxNotes.css'

const BulletIcon = (
  <div style={{ padding: '8px 6px 8px 0', display: 'flex', alignItems: 'center' }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
      <circle cx="3" cy="3" r="3" fill="#525252"/>
    </svg>
  </div>
)

const InboxNotes = () => {
  const [notes, setNotes] = useState([])
  const [inputKey, setInputKey] = useState(0)

  const addNote = (text) => {
    if (!text || !text.trim()) return
    const newNote = {
      id: Date.now().toString(),
      text: text.trim()
    }
    // New notes must be at the top
    setNotes(prev => [newNote, ...prev])
    // Reset the input component by changing its key
    setInputKey(prev => prev + 1)
  }

  const updateNote = (id, newText) => {
    if (!newText || !newText.trim()) {
       // If empty, maybe delete? Or just keep previous?
       // NoteLink handles empty by showing placeholder, but here we might want to delete if explicitly empty?
       // NoteLink calls onDelete if backspace/delete on empty.
       // On Enter with empty: NoteLink calls onEnter with empty string.
       // Let's just update, and if it's empty, it will show "Заметка".
       // Or we can delete it.
       return
    }
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, text: newText } : note
    ))
  }

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(note => note.id !== id))
  }

  return (
    <div className="inbox-notes">
      <div className="inbox-notes__list">
        {notes.map(note => (
          <NoteLink
            key={note.id}
            initialValue={note.text}
            onEnter={(val) => updateNote(note.id, val)}
            onDelete={() => deleteNote(note.id)}
            style={{ width: '100%' }}
            icon={BulletIcon}
            multiline={true}
          />
        ))}
      </div>
      <div className="inbox-notes__input-wrapper">
        <NoteLink
          key={`new-note-${inputKey}`}
          onEnter={addNote}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  )
}

export default InboxNotes
