import { CalendarProvider } from './context/CalendarContext'
import Calendar from './pages/Calendar'
import './App.css'

function App() {
  return (
    <CalendarProvider>
      <div className="app">
        <main className="app-main">
          <Calendar />
        </main>
      </div>
    </CalendarProvider>
  )
}

export default App
