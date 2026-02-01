import React from 'react'
import ReactDOM from 'react-dom/client'
import { CalendarProvider } from './context/CalendarContext'
import Calendar from './pages/Calendar'
import './fonts/fonts.css'
import './tokens/colors.css'
import './tokens/roundings.css'
import './tokens/spacings.css'
import './index.css'

// Standalone Calendar page without header and navigation tabs
function StandaloneCalendar() {
  return (
    <CalendarProvider>
      <Calendar />
    </CalendarProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StandaloneCalendar />
  </React.StrictMode>,
)
