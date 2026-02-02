import { useState, useCallback, useRef, useEffect } from 'react'

/**
 * Custom hook for managing localStorage
 * @param {string} key - localStorage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @returns {[any, Function]} - [value, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/0a1f3231-f882-46b3-abf6-83c831abb2fc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useLocalStorage.js:INIT',message:'getItem on load',data:{key,rawItem:item,parsed:item?JSON.parse(item):null,usingInitial:!item},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2'})}).catch(()=>{});
      // #endregion
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/0a1f3231-f882-46b3-abf6-83c831abb2fc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useLocalStorage.js:INIT_ERROR',message:'Error reading localStorage',data:{key,error:error.message},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3'})}).catch(()=>{});
      // #endregion
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Keep a ref of the current value for functional updates
  const storedValueRef = useRef(storedValue)

  useEffect(() => {
    storedValueRef.current = storedValue
  }, [storedValue])

  const setValue = useCallback((value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValueRef.current) : value
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/0a1f3231-f882-46b3-abf6-83c831abb2fc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useLocalStorage.js:SET',message:'setValue called',data:{key,isFn:value instanceof Function,refBefore:storedValueRef.current,valueToStore,itemCount:Array.isArray(valueToStore)?valueToStore.length:null},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1,H4'})}).catch(()=>{});
      // #endregion
      setStoredValue(valueToStore)
      storedValueRef.current = valueToStore
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/0a1f3231-f882-46b3-abf6-83c831abb2fc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useLocalStorage.js:SET_DONE',message:'localStorage.setItem completed',data:{key,storedString:window.localStorage.getItem(key)?.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/0a1f3231-f882-46b3-abf6-83c831abb2fc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useLocalStorage.js:SET_ERROR',message:'Error setting localStorage',data:{key,error:error.message},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3'})}).catch(()=>{});
      // #endregion
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key])

  return [storedValue, setValue]
}
